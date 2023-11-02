import React, { Fragment } from "react";

import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <Fragment>
      <button
        type={props.type || "button"}
        className={`${classes.button} ${props.className}`}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.children}
      </button>
    </Fragment>
  );
};

export default Button;
