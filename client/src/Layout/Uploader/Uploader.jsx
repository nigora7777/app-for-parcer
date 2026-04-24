
const Uploader = (props) => {
  const {
    loading,
    selectedFiles = [], 
    handleFileChange,
    handlePick,
    fileInputRef,
    removeFile,
    clearFiles,
    SUPPORTED_FORMATS = [],
  } = props;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 KB";
    const mb = bytes / 1024 / 1024;
    return mb < 1
      ? (bytes / 1024).toFixed(1) + " KB"
      : mb.toFixed(1) + " MB";
  };

  return (
    <div className="card shadow-sm border-primary w-100"
      style={{
        backgroundColor: "#dcdee0", 
        border: "1px solid #ccc",
      }}>
      <div className="card-body p-3">
        <h5 className="mb-3">Файлы</h5>
        
        <div className="mb-4">
          <div className="d-flex gap-2 mb-2 align-items-start">
            <button
              onClick={handlePick}
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              Выбрать файлы
            </button>

            <input
              className="d-none"
              id="user_files"
              name="file"
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              disabled={loading}
              accept={(SUPPORTED_FORMATS || []).map((f) => `.${f}`).join(",")}
            />

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={clearFiles}
              disabled={loading || (selectedFiles || []).length === 0}
            >
              Очистить все {(selectedFiles || []).length}
            </button>
          </div>

          <p className="small text-muted mb-2">
            Поддерживаемые форматы: {(SUPPORTED_FORMATS || []).join(", ")}
          </p>

          {/* Проверка длины массива */}
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="alert alert-info small p-2 mb-3">
              <div>
                <strong>Файлов:</strong>{" "}
                <span className="btn btn-outline-info">{selectedFiles.length}</span>
              </div>
            </div>
          )}

          {selectedFiles && selectedFiles.length > 0 && (
            <div className="ms-2 mb-3">
              <ul className="list-unstyled small mb-2">
                {selectedFiles.map((file, index) => (
                  <li
                    key={file.name + index}
                    className="d-flex justify-content-between align-items-center mb-1 p-1 bg-light rounded"
                  >
                    <span className="flex-grow-1 text-truncate">
                      {file.name.length > 30
                        ? file.name.slice(0, 30) + "..."
                        : file.name}{" "}
                      <small>({formatFileSize(file.size)})</small>
                    </span>
                    <button
                      type="button"
                      className="btn-close btn-close-sm"
                      onClick={() => removeFile(index)}
                      disabled={loading}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Uploader;
