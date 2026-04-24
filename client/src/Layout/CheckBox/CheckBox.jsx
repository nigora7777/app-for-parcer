
const CheckBox = (props) => {
  const {
    loading, 
    useOcr,
    useHeadings,
    iterations,
    requestTimeout,
    retries,
    changeNumber,
    toggleCheckbox,
    parseFormats = new Set(),
    toggleFormat,
    SUPPORTED_FORMATS,
    handleSubmit,
    errorMessage,  
  } = props;

  return (
    <div
      className="card shadow-sm border-success w-100"
      style={{ backgroundColor: "#dcdee0", border: "1px solid #ccc" }}
    >
      <div className="card-body p-3">
        <h5 className="mb-3">Настройки парсера</h5>

        <form onSubmit={handleSubmit}>

          {/* Форматы документов */}
          <div className="mb-4">
            <label className="form-label fw-bold mb-1 d-block">
              Форматы документов <span className="text-danger">*</span>
            </label>
            <small className="text-muted d-block mb-2">
              Выберите форматы файлов, которые нужно обработать. 
              Файлы других форматов будут проигнорированы.
            </small>
            <div className="d-flex flex-wrap gap-2">
              {SUPPORTED_FORMATS.map(format => (
                <div key={format} className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`format-${format}`}
                    checked={parseFormats.has(format)}
                    onChange={() => toggleFormat(format)}
                    disabled={loading}
                  />
                  <label className="form-check-label small" htmlFor={`format-${format}`}>
                    .{format}
                  </label>
                </div>
              ))}
            </div>
            {parseFormats.size === 0 && (
              <small className="text-danger d-block mt-1">
                Это обязательное поле. Выберите хотя бы один формат для обработки.
              </small>
            )}
          </div>

          {/* OCR */}
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="use_ocr"
                name="use_ocr"
                checked={useOcr}
                onChange={(e) => toggleCheckbox("use_ocr", e.target.checked)}
                disabled={loading}
              />
              <label className="form-check-label fw-semibold" htmlFor="use_ocr">
                Оптическое распознавание (OCR)
              </label>
            </div>
            <small className="text-muted d-block ms-4 mt-1">
            </small>
          </div>

          {/* Структура заголовков */}
          <div className="mb-4">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="use_headings"
                name="use_headings"
                checked={useHeadings}
                onChange={(e) => toggleCheckbox("use_headings", e.target.checked)}
                disabled={loading}
              />
              <label className="form-check-label fw-semibold" htmlFor="use_headings">
                Использовать структуру заголовков
              </label>
            </div>
            <small className="text-muted d-block ms-4 mt-1">
            </small>
          </div>

          {/* Итерации */}
          <div className="mb-4">
            <label className="form-label fw-semibold mb-0" htmlFor="iterations">
              Количество итераций извлечения
            </label>
            <small className="text-muted d-block mb-2">
            </small>
            <div className="input-group w-50">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => changeNumber("iterations", Math.max(1, (Number(iterations) || 1) - 1))}
                disabled={loading}
              >−</button>
              <input
                id="iterations"
                className="form-control text-center fw-bold"
                value={iterations}
                onChange={(e) => changeNumber("iterations", e.target.value)}
                onBlur={() => {
                  let num = parseInt(iterations, 10);
                  if (isNaN(num) || num < 1) num = 1;
                  if (num > 5) num = 5;
                  changeNumber("iterations", num);
                }}
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => changeNumber("iterations", Math.min(5, (Number(iterations) || 1) + 1))}
                disabled={loading}
              >+</button>
            </div>
          </div>

          {/* Тайм-аут */}
          <div className="mb-4">
            <label className="form-label fw-semibold mb-0" htmlFor="requestTimeout">
              Тайм-аут запросов к LLM (сек.)
            </label>
            <small className="text-muted d-block mb-2">
            </small>
            <div className="input-group w-50">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  const current = parseInt(requestTimeout, 10) || 30;
                  changeNumber("requestTimeout", Math.max(30, current - 10));
                }}
                disabled={loading}
              >−</button>
              <input
                id="requestTimeout"
                name="requestTimeout"
                type="text"
                className="form-control text-center fw-bold"
                value={requestTimeout}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) {
                    changeNumber("requestTimeout", val);
                  }
                }}
                onBlur={() => {
                  let num = parseInt(requestTimeout, 10);
                  if (isNaN(num) || num < 30) num = 30;
                  if (num > 300) num = 300;
                  changeNumber("requestTimeout", num);
                }}
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  const current = parseInt(requestTimeout, 10) || 30;
                  changeNumber("requestTimeout", Math.min(300, current + 10));
                }}
                disabled={loading}
              >+</button>
            </div>
          </div>

          {/* Повторы при ошибке */}
          <div className="mb-4">
            <label className="form-label fw-semibold mb-0" htmlFor="retries">
              Повторных запросов при ошибке
            </label>
            <small className="text-muted d-block mb-2">
            </small>
            <div className="input-group w-50">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => changeNumber("retries", Math.max(1, (Number(retries) || 1) - 1))}
                disabled={loading}
              >−</button>
              <input
                id="retries"
                name="retries"
                className="form-control text-center fw-bold"
                value={retries}
                onChange={(e) => changeNumber("retries", e.target.value)}
                onBlur={() => {
                  let num = parseInt(retries, 10);
                  if (isNaN(num) || num < 1) num = 1;
                  if (num > 5) num = 5;
                  changeNumber("retries", num);
                }}
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => changeNumber("retries", Math.min(5, (Number(retries) || 1) + 1))}
                disabled={loading}
              >+</button>
            </div>
          </div>

          {/* все ошибки */}
          {errorMessage && (
            <div className="alert alert-danger py-2 mb-3" role="alert">
              {errorMessage}
            </div>
          )}

          <button
            id="submit_btn"
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Обработка...
              </>
            ) : "Создать задачу"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CheckBox;