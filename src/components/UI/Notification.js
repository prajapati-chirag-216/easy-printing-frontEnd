import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import Card from "./Card";
import classes from "./Notification.module.css";

const ModalOverlay = (props) => (
  <Card className={`${classes.modal} ${classes.hideMe}`}>
    <header className={classes.header}>
      <h2>{props.title}</h2>
    </header>
    <div className={classes.content}>
      <p>{props.message}</p>
    </div>
  </Card>
);

const Notification = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <ModalOverlay title={props.title} message={props.message} />,
        document.getElementById("overlay-root")
      )}
    </Fragment>
  );
};

export default Notification;
