import { useRef, useReducer, useState, useEffect, Fragment } from "react";
import { Link, Form, redirect, useActionData } from "react-router-dom";
import classes from "./action.module.css";
import Input from "../components/input/Input";
import Button from "../components/Button/Button";
import { addNewAdmin } from "../lib/api";
import store from "../store/index";
import { authActions } from "../store/auth-slice";
import {
  nameReducer,
  emailReducer,
  passwordReducer,
} from "../components/reducers/InputReducers";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../components/UI/Notification";
import { uiActions } from "../store/ui-slice";

const Signup = () => {
  const actionData = useActionData();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const showNotification = useSelector((state) => state.ui.showNotification);
  const dispatch = useDispatch();

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [formIsValid, setFormIsValid] = useState(false);

  const [nameState, dispatchName] = useReducer(nameReducer, {
    value: "",
    isValid: null,
  });
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const { isValid: nameIsValid } = nameState;
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(nameIsValid && emailIsValid && passwordIsValid);
    }, 500);

    return () => clearTimeout(identifier);
  }, [nameIsValid, emailIsValid, passwordIsValid]);

  const nameChangeHandler = (event) => {
    dispatchName({ type: "USER_INPUT", val: event.target.value });
  };
  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };
  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };
  const validateNameHandler = () => {
    dispatchName({ type: "INPUT_BLUR" });
  };
  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };
  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const validateFormHandler = (event) => {
    event.preventDefault();
    if (!nameIsValid) {
      nameInputRef.current.focus();
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };
  useEffect(() => {
    if (actionData && actionData.response.status === 502) {
      dispatch(uiActions.showNotification(true));
      setTimeout(() => {
        dispatch(uiActions.showNotification(false));
      }, 4000);
      emailInputRef.current.focus();
    }
  }, [actionData, dispatch]);

  return (
    <Fragment>
      {isLoggedIn && (
        <Notification
          title="An account is already logged in."
          message="By creating new account will automatically logged out existing device"
        />
      )}
      {showNotification && (
        <Notification message="An account is already exist with this E-mail id. " />
      )}
      <div className={classes.action}>
        <Form method="post" action="/admin" encType="multipart/form-data">
          <Input
            ref={nameInputRef}
            label="ShopName"
            type="text"
            id="shopname"
            value={nameState.value}
            onChange={nameChangeHandler}
            onBlur={validateNameHandler}
            isValid={nameIsValid}
          />
          <Input
            placeholder="admin@example.com"
            ref={emailInputRef}
            label="E-Mail"
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
            isValid={emailIsValid}
          />
          <Input
            ref={passwordInputRef}
            label="Password"
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
            isValid={passwordIsValid}
          />
          <Input label="Image" type="file" id="image" accept="image" />
          <fieldset className={classes.actions}>
            <Button
              type="submit"
              onClick={!formIsValid ? validateFormHandler : () => {}}
              disabled={showNotification}
            >
              Signup
            </Button>
          </fieldset>
          <fieldset className={classes.actions}>
            <p>
              Already have an account? <Link to="/admin/signin"> Signin </Link>
            </p>
          </fieldset>
        </Form>
      </div>
    </Fragment>
  );
};
export async function action({ request }) {
  let response;
  const formData = await request.formData();
  const admin = {
    shopName: formData.get("shopname"),
    email: formData.get("email"),
    password: formData.get("password"),
    image: formData.get("image"),
  };
  try {
    response = await addNewAdmin(admin);
  } catch (err) {
    if (
      err.response.data.code === 11000 &&
      err.response.data.keyPattern.email === 1
    ) {
      return err;
    }
    throw err;
  }
  store.dispatch(
    authActions.login({
      loggedIn: true,
    })
  );
  return redirect("/home");
}
export default Signup;
