import { useCallback, useState, useEffect, useRef } from "react";
import axios from "axios";

const BASE_URL = "http://91.201.54.86:8000/api/v1"; 
const SUPPORTED_FORMATS = ["doc", "docx", "ppt", "pptx", "pdf", "txt", "md"];
const MAX_SIZE = 50 * 1024 * 1024;
const SETTINGS_KEY = "parserSettings";

const useParserSettings = () => {
  const filePicker = useRef(null);
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [taskStatus, setTaskStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [isPolling, setIsPolling] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const [parseFormats, setParseFormats] = useState(new Set());
  const [iterations, setIterations] = useState(1);
  const [useOcr, setUseOcr] = useState(false);
  const [useHeadings, setUseHeadings] = useState(false);
  const [requestTimeout, setRequestTimeout] = useState(30);
  const [retries, setRetries] = useState(1);

  const mapError = (status) => ({
    400: 'Ошибка запроса — проверьте данные формы',
    413: 'Файл слишком большой (максимум 50MB)',
    415: 'Недопустимый формат файла',
    422: 'Некорректные параметры запроса',
    404: 'Задача не найдена',
    409: 'Задача ещё не завершена',
    500: 'Внутренняя ошибка сервера',
    503: 'Сервер временно недоступен, попробуйте позже',
  }[status] || 'Ошибка сети или сервера. Попробуйте позже.');

  const handlePick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event) => {
    const newFiles = Array.from(event.target.files);
    if (newFiles.length === 0) return;

      const validateFile = (file) => {
      const ext = file.name.toLowerCase().split('.').pop();
      if (file.size === 0) {
        setErrorMessage(`Файл "${file.name}" пустой`);
        return false;
      }
      if (file.size > MAX_SIZE) {
        setErrorMessage(`Файл "${file.name}" слишком большой (максимум 50MB)`);
        return false;
      }
      if (!SUPPORTED_FORMATS.includes(ext)) {
        setErrorMessage(`Недопустимый формат "${file.name}". Разрешены: ${SUPPORTED_FORMATS.join(', ')}`);
        return false;
      }
      return true;
    };

    const allFilesValid = newFiles.every(file => validateFile(file));
    if (!allFilesValid) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFiles((prevFiles) => {
      const existingSignatures = prevFiles.map(f => `${f.name}-${f.size}-${f.lastModified}`);
      const uniqueNewFiles = newFiles.filter(file =>
        !existingSignatures.includes(`${file.name}-${file.size}-${file.lastModified}`)
      );
      if (uniqueNewFiles.length === 0) {
        setErrorMessage('Эти файлы уже добавлены в список');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return prevFiles;
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
      return [...prevFiles, ...uniqueNewFiles];
    });
  }, [setSelectedFiles]);

  const toggleFormat = useCallback((format) => {
    setParseFormats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(format)) newSet.delete(format);
      else newSet.add(format);
      return newSet;
    });
  }, []);

  const removeFile = useCallback((indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== indexToRemove));
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setTaskStatus(null);
    setErrorMessage(null);
    if (filePicker.current) filePicker.current.value = '';
  }, []);

  const toggleCheckbox = useCallback((name, value) => {
    if (name === 'use_ocr') setUseOcr(value);
    if (name === 'use_headings') setUseHeadings(value);
  }, []);

  const changeNumber = useCallback((name, value) => {
    if (value === "") {
      if (name === 'iterations') setIterations("");
      if (name === 'requestTimeout') setRequestTimeout("");
      if (name === 'retries') setRetries("");
      return;
    }
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    if (name === 'iterations') setIterations(num);
    if (name === 'requestTimeout') setRequestTimeout(num);
    if (name === 'retries') setRetries(num);
  }, []);

  const createTask = useCallback(async (formData) => {
    setUploadProgress(0); 
    return axios.post(`${BASE_URL}/tasks`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
      onUploadProgress: (event) => {
        if (!event.total) return;
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      },
    });
  }, []);


  const saveTaskToStorage = useCallback((task_id) => {
    const task = { id: task_id, created_at: new Date().toISOString() };
    localStorage.setItem('lastTask', JSON.stringify(task));
    setUserFiles([task]); // всегда один элемент
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event?.preventDefault?.();
    setErrorMessage(null);

    if (selectedFiles.length === 0) {
      setErrorMessage('Выберите хотя бы один файл');
      return;
    }
    if (parseFormats.size === 0) {
      setErrorMessage('Выберите хотя бы один формат документа');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('file', file));
    formData.append('iterations', iterations);
    formData.append('use_ocr', useOcr);
    formData.append('use_headings', useHeadings);
    formData.append('timeout', requestTimeout);
    formData.append('retries', retries);
    formData.append('parse_formats', Array.from(parseFormats).join(','));

    try {
      const response = await createTask(formData);
      const taskData = response.data;
      setTaskStatus(taskData);
      saveTaskToStorage(taskData.task_id);
      setIsPolling(taskData.status !== 'completed');
    } catch (err) {
      setErrorMessage(mapError(err.response?.status));
    } finally {
      setLoading(false);
    }
  }, [selectedFiles, parseFormats, iterations, useOcr, useHeadings, requestTimeout, retries, createTask, saveTaskToStorage]);

  const fetchTaskStatus = useCallback(async (task_id) => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/${task_id}/status`);
      setTaskStatus(res.data);
      if (['completed', 'failed'].includes(res.data.status)) {
        setIsPolling(false);
      }
    } catch (error) {
      setErrorMessage('Не удалось получить статус задачи. Проверьте соединение.');
      setIsPolling(false);
    }
  }, []);

  const downloadFile = useCallback(async (task_id) => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/${task_id}/result`, { 
        responseType: 'blob' 
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dataset_${task_id}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMessage(mapError(err.response?.status));
    }
  }, []);


  useEffect(() => {
    let interval;
    if (isPolling && taskStatus?.task_id && !['completed', 'failed'].includes(taskStatus.status)) {
      interval = setInterval(() => fetchTaskStatus(taskStatus.task_id), 3000);
    }
    return () => clearInterval(interval);
  }, [taskStatus, fetchTaskStatus, isPolling]);


  useEffect(() => {
    if (taskStatus?.status === 'completed' && isPolling) {
      setIsPolling(false);
    }
  }, [taskStatus, isPolling]);

  useEffect(() => {
  const saved = localStorage.getItem('lastTask');
  if (saved) {
    try {
      const task = JSON.parse(saved);
      setUserFiles([task]);
    } catch (e) {}
  }
  }, []);


  useEffect(() => {
  localStorage.removeItem('tasks');
  localStorage.removeItem('user_id');
  const oldKey = Object.keys(localStorage).find(k => k.startsWith('user_') && k.endsWith('_tasks'));
  if (oldKey) localStorage.removeItem(oldKey);
}, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      parseFormats: Array.from(parseFormats),
      iterations, useOcr, useHeadings, requestTimeout, retries
    }));
  }, [parseFormats, iterations, useOcr, useHeadings, requestTimeout, retries]);


  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setParseFormats(new Set(s.parseFormats || []));
        setIterations(s.iterations || 1);
        setUseOcr(!!s.useOcr);
        setUseHeadings(!!s.useHeadings);
        setRequestTimeout(s.requestTimeout || 30);
        setRetries(s.retries || 3);
      } catch (e) {}
    }
  }, []);

  return {
    loading, taskStatus,
    selectedFiles, handleFileChange, handlePick, filePicker,
    removeFile, clearFiles,
    parseFormats, toggleFormat,
    iterations, changeNumber,
    useOcr, useHeadings, requestTimeout, retries, toggleCheckbox,
    SUPPORTED_FORMATS, MAX_SIZE,
    handleSubmit, fileInputRef,
    downloadFile, isPolling, uploadProgress, userFiles,
    errorMessage, setErrorMessage,
    saveTaskToStorage
  };
};

export default useParserSettings;