import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import Card from "./Card";
import classes from "./PromptModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const Backdrop = (props) => (
  <div className={classes.backdrop} onClick={props.onConfirm} />
);

const ModalOverlay = (props) => (
  <Card className={classes.modal}>
    <header className={classes.header}>
      <h2>{props.title}</h2>
      <span className={classes.icon}>
        <FontAwesomeIcon
          icon={faClose}
          onClick={props.onConfirm}
        ></FontAwesomeIcon>
      </span>
    </header>
    <div className={classes.content}>
      <p>{props.message}</p>
    </div>
  </Card>
);

const PromptModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          onConfirm={props.onConfirm}
          title={props.title}
          message={props.message}
        />,
        document.getElementById("overlay-root")
      )}
    </Fragment>
  );
};
export default PromptModal;
