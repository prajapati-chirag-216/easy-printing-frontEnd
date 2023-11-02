import { useState, useEffect } from "react";
import FileData from "../components/files/FileData";
import { useLocation } from "react-router-dom";
import classes from "./FilesToPrint.module.css";

const FilesToPrint = () => {
  const location = useLocation();
  const { files } = location.state;
  const [index, setIndex] = useState(0);

  const showPdfHandler = (fileIndex) => {
    setIndex(fileIndex);
  };

  window.addEventListener("beforeprint", () => {
    const elementsToHide = document.getElementById("pdf-file");
    elementsToHide.style.display = "none";
  });
  window.addEventListener("afterprint", () => {
    const elementsToHide = document.getElementById("pdf-file");
    elementsToHide.style.display = "block";
  });

  return (
    <div className={classes.component}>
      {console.log(files)}
      <FileData onShowPdf={showPdfHandler} loaderData={files} index={index} />
      <object
        type="application/pdf"
        data={files[index].file + "#toolbar=0"}
        className={classes.object}
        id="pdf-file"
      >
        <p className="centered">Unable to load File</p>
      </object>
    </div>
  );
};
export default FilesToPrint;
