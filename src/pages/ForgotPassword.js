import { useRef, useReducer, Fragment, useEffect } from "react";
import { useActionData, Form, redirect } from "react-router-dom";
import classes from "./action.module.css";
import Input from "../components/input/Input";
import Button from "../components/Button/Button";
import { forgotPassword } from "../lib/api";
import { emailReducer } from "../components/reducers/InputReducers";
import store from "../store";
import { uiActions } from "../store/ui-slice";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../components/UI/Notification";

const ForgetPassword = () => {
  const emailInputRef = useRef();
  const showNotification = useSelector((state) => state.ui.showNotification);
  const dispatch = useDispatch();

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const { isValid: emailIsValid } = emailState;

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };
  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validateFormHandler = (event) => {
    event.preventDefault();
    if (!emailIsValid) {
      emailInputRef.current.focus();
    }
  };

  const actionData = useActionData();
  useEffect(() => {
    if (actionData && actionData.response.status === 502) {
      dispatch(uiActions.showNotification(true));
      setTimeout(() => {
        dispatch(uiActions.showNotification(false));
      }, 4000);
      emailInputRef.current.focus();
    }
  }, [actionData]);

  return (
    <Fragment>
      {showNotification && (
        // <p className="centered">{actionData.response.data.message}</p>
        <Notification message={actionData.response.data.message} />
      )}
      <div className={classes.action}>
        <Form method="post" action="/admin/forgotPassword">
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
          <div className={classes.actions}>
            <Button
              type="submit"
              onClick={!emailIsValid ? validateFormHandler : () => {}}
            >
              ResetPassword
            </Button>
          </div>
        </Form>
      </div>
    </Fragment>
  );
};
export async function action({ request }) {
  const formData = await request.formData();
  const admin = {
    email: formData.get("email"),
  };
  try {
    await forgotPassword(admin);
  } catch (err) {
    if (err.response.status === 502) {
      return err;
    }
    throw err;
  }
  store.dispatch(uiActions.success(true));
  return redirect("/success");
}
export default ForgetPassword;
