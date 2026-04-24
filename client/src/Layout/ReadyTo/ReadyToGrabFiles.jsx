import React, { useCallback, useState } from "react";

const ReadyToGrabFiles = ({ 
  userFiles = [], 
  downloadFile, 
  loading, 
  taskStatus,
}) => {
  const [downloadError, setDownloadError] = useState(null);

  const handleDownload = useCallback(async (task_id) => {
    if (typeof downloadFile === "function") {
      try {
        setDownloadError(null);
        await downloadFile(task_id);
      } catch (error) {
        setDownloadError('Не удалось скачать файл. Попробуйте позже.');
      }
    }
  }, [downloadFile]);

  const getStatusLabel = (status) => ({
    completed:  { text: "Готово",              badge: "bg-success" },
    failed:     { text: "Ошибка",              badge: "bg-danger"  },
    pending:    { text: "В ожидании...",        badge: "bg-secondary" },
    processing: { text: "В процессе...",        badge: "bg-primary"  },
    retrying:   { text: "Повторная попытка...", badge: "bg-warning text-dark" },
  }[status] || { text: status?.toUpperCase(), badge: "bg-secondary" });


  const restoredTask = userFiles[0] ?? null;
  const restoredTaskId = restoredTask?.id ?? restoredTask?.task_id ?? null;

  
  const hasActiveTask = !!taskStatus;

  const showRestoredOnly = !hasActiveTask && !!restoredTaskId;

  return (
    <div className="card mt-4" style={{ backgroundColor: "#dcdee0", border: "1px solid #ccc" }}>

      <div
        className="card-header p-3"
        style={{ backgroundColor: "#d4d7da" }}
      >
        <h5 className="mb-0">Парсинговые файлы</h5>
      </div>

      <div className="card-body pb-3">

        {/* Активная задача  */}
        {hasActiveTask && (
          <>
            <h6 className="mb-2">
              <strong>Текущая задача:</strong>{" "}
              <span className={`badge ms-1 ${getStatusLabel(taskStatus.status).badge}`}>
                {getStatusLabel(taskStatus.status).text}
              </span>
            </h6>

            {/* Прогресс-бар */}
          {!["completed", "failed"].includes(taskStatus.status) && (
            <div className="progress mb-2" style={{ height: "10px" }}>
              <div
                className="progress-bar progress-bar-animated progress-bar-striped"
                role="progressbar"
                style={{
                  width: {
                    pending:    "30%",
                    processing: "65%",
                    retrying:   "80%",
                  }[taskStatus.status] ?? "100%"
                }}
              />
            </div>
          )}

            {taskStatus.step_description && (
              <small className="text-muted d-block mb-2">
                {taskStatus.step_description}
              </small>
            )}


            {taskStatus.status === "completed" && taskStatus.task_id && (
              <button
                className="btn btn-success btn-sm w-100 mt-1"
                onClick={() => handleDownload(taskStatus.task_id)}
                disabled={loading}
              >
                Скачать результат (ID: {taskStatus.task_id?.slice(0, 8)})
              </button>
            )}

    
            {taskStatus.status === "failed" && taskStatus.user_message && (
              <div className="alert alert-danger py-2 mt-2 mb-0 small">
                <strong>Ошибка обработки:</strong> {taskStatus.user_message}
              </div>
            )}
          </>
        )}

        {showRestoredOnly && (
          <>
            <p className="text-muted small mb-2">
              Последняя задача от{" "}
              {restoredTask.created_at
                ? new Date(restoredTask.created_at).toLocaleString()
                : "неизвестной даты"}
            </p>
            <button
              className="btn btn-success btn-sm w-100"
              onClick={() => handleDownload(restoredTaskId)}
              disabled={loading}
            >
              Скачать результат (ID: {restoredTaskId?.slice(0, 8)})
            </button>
          </>
        )}

        {/* Ничего нет */}
        {!hasActiveTask && !showRestoredOnly && (
          <p className="text-muted mb-0 text-center">
            Результат появится после завершения задачи
          </p>
        )}

        {/* Ошибка скачивания */}
        {downloadError && (
          <div className="alert alert-danger py-2 mt-2 mb-0 small">
            {downloadError}
          </div>
        )}

      </div>
    </div>
  );
};

export default ReadyToGrabFiles;