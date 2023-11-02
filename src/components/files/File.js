import classes from "./File.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faClose } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { Fragment } from "react";

const File = (props) => {
  return (
    <Fragment>
      <li className={classes.tile}>
        <figure>
          <figcaption>{props.name}</figcaption>
          <blockquote>
            <FontAwesomeIcon icon={faFile} /> {props.filesLen}
          </blockquote>
        </figure>
        <div className={classes["action-div"]}>
          <span
            className={classes.trash}
            onClick={props.onDeleteUser.bind(null, props.id)}
          >
            <FontAwesomeIcon icon={faClose} />
          </span>
          <NavLink
            className={classes.btn}
            to="/filesToPrint"
            state={{ files: props.files }}
          >
            View Fullscreen
          </NavLink>
        </div>
      </li>
    </Fragment>
  );
};
export default File;
