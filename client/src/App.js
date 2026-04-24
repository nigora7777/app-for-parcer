import Header from "./Header/Header";
import ReadyToGrabFiles from "./Layout/ReadyTo/ReadyToGrabFiles";
import Uploader from "./Layout/Uploader/Uploader";
import CheckBox from "./Layout/CheckBox/CheckBox"; 
import useParserSettings from "./Layout/Hooks/useParserSettings";

function App() {
 
  const parser = useParserSettings();

  return (
    <div className="container-fluid px-0"
      style={{
          backgroundColor: "#a9adad",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
    >
      <Header />

      <div className="container py-3">
        <div className="d-flex flex-wrap gap-4">
          <div className="flex-grow-1 d-flex flex-column gap-4" style={{ maxWidth: "550px" }}>
            <Uploader 
              selectedFiles={parser.selectedFiles}
              handlePick={parser.handlePick}
              handleFileChange={parser.handleFileChange}
              removeFile={parser.removeFile}
              clearFiles={parser.clearFiles}
              fileInputRef={parser.fileInputRef}
              loading={parser.loading}
              SUPPORTED_FORMATS={parser.SUPPORTED_FORMATS}
            />
            <CheckBox 
              {...parser} 
              SUPPORTED_FORMATS={parser.SUPPORTED_FORMATS}
              handleSubmit={(e) => {
                e.preventDefault();
                parser.handleSubmit(e);
              }}
            />
          </div>
          <div className="flex-grow-1" style={{ maxWidth: "500px" }}>
            <ReadyToGrabFiles 
            taskStatus={parser.taskStatus}    
            userFiles={parser.userFiles}     
            fetchUserFiles={parser.fetchUserFiles} 
            downloadFile={parser.downloadFile} 
            loading={parser.loading}        
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
