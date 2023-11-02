import classes from "./FileData.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const FileData = (props) => {
  return (
    <nav className={classes.nav}>
      <h1 className={classes.title}>
        <FontAwesomeIcon icon={faFile} /> Files
      </h1>
      <ul>
        {props.loaderData.map((userFile, fileIndex) => (
          <li
            onClick={props.onShowPdf.bind(null, fileIndex)}
            key={fileIndex}
            className={fileIndex === props.index ? classes["active-li"] : ""}
          >
            {userFile.title}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FileData;
