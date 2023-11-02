import { useRef, useReducer, useState, useEffect, Fragment } from "react";
import { Form, Link, useActionData, useNavigate } from "react-router-dom";
import classes from "./action.module.css";
import Input from "../components/input/Input";
import Button from "../components/Button/Button";
import { signinAdmin } from "../lib/api";
import {
  emailReducer,
  passwordReducer,
} from "../components/reducers/InputReducers";
import store from "../store/index";
import { authActions } from "../store/auth-slice";
import Notification from "../components/UI/Notification";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

const Signin = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [formIsValid, setFormIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showNotification } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => clearTimeout(identifier);
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };
  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };
  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };
  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };
  const showPasswordHandler = () => {
    setShowPassword((prevState) => {
      return !prevState;
    });
  };
  const validateFormHandler = (event) => {
    event.preventDefault();
    if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };
  const navigate = useNavigate();
  const actionData = useActionData();
  useEffect(() => {
    if (actionData && actionData.response.success) {
      navigate("/home", { replace: true });
    }
    if (actionData && actionData.response.status === 502) {
      dispatch(uiActions.showNotification(true));
      setTimeout(() => {
        dispatch(uiActions.showNotification(false));
      }, 4000);
      if (actionData.response.data.validityStatus === "email")
        emailInputRef.current.focus();
      else passwordInputRef.current.focus();
    }
    // eslint-disable-next-line
  }, [actionData, dispatch]);

  return (
    <Fragment>
      {showNotification && (
        <Notification
          message={actionData.response.data.message || actionData.response.data}
        />
      )}
      <div className={classes.action}>
        <Form method="post" action="/admin/signin">
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
            type={showPassword ? "text" : "password"}
            id={showPassword ? "text" : "password"}
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
            isValid={passwordIsValid}
          />
          <fieldset className={classes.info}>
            <div>
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                onClick={showPasswordHandler}
                className={classes["fa-globe"]}
              />
              <label> {showPassword ? "Hide " : "Show "} password </label>
            </div>
            <div className={classes["link-div"]}>
              <Link to="/admin/forgotPassword">Forgot Password?</Link>
            </div>
          </fieldset>

          <fieldset className={classes.actions}>
            <Button
              type="submit"
              onClick={!formIsValid ? validateFormHandler : () => {}}
              disabled={showNotification}
            >
              Signin
            </Button>
          </fieldset>
          <fieldset className={classes.actions}>
            <p>
              Not a member? <Link to="/admin"> Register </Link>
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
    email: formData.get("email"),
    password: formData.get("password") || formData.get("text"),
  };
  try {
    response = await signinAdmin(admin);
  } catch (err) {
    if (
      err.response &&
      (err.response.status === 502 || err.response.status === 429)
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
  return response;
}
export default Signin;
