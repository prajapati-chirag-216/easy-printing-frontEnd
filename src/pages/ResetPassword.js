import { useRef, useReducer, Fragment, useEffect } from "react";
import { Form, redirect, useParams, useActionData } from "react-router-dom";
import classes from "./action.module.css";
import Input from "../components/input/Input";
import Button from "../components/Button/Button";
import { resetPassword } from "../lib/api";
import { passwordReducer } from "../components/reducers/InputReducers";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import Notification from "../components/UI/Notification";

const ResetPassword = () => {
  const params = useParams();
  const passwordInputRef = useRef();
  const showNotification = useSelector((state) => state.ui.showNotification);
  const dispatch = useDispatch();

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const { isValid: passwordIsValid } = passwordState;

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const validateFormHandler = (event) => {
    event.preventDefault();
    if (!passwordIsValid) {
      passwordInputRef.current.focus();
    }
  };

  const actionData = useActionData();
  useEffect(() => {
    if (actionData && actionData.response.status) {
      dispatch(uiActions.showNotification(true));
      setTimeout(() => {
        dispatch(uiActions.showNotification(false));
      }, 4000);
    }
  }, [dispatch, actionData]);
  console.log(params.tokenId);
  return (
    <Fragment>
      {showNotification && (
        <Notification message={actionData.response.data.message} />
      )}
      <div className={classes.action}>
        <Form method="post" action={`/admin/resetPassword/${params.tokenId}`}>
          <Input
            ref={passwordInputRef}
            label="New-Password"
            type="password"
            id="new-password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
            isValid={passwordIsValid}
          />
          <div className={classes.actions}>
            <Button
              type="submit"
              onClick={!passwordIsValid ? validateFormHandler : () => {}}
              disabled={showNotification}
            >
              Confirm
            </Button>
          </div>
        </Form>
      </div>
    </Fragment>
  );
};
export async function action({ request, params }) {
  const formData = await request.formData();
  const admin = {
    token: params.tokenId,
    newPassword: formData.get("new-password"),
  };
  try {
    await resetPassword(admin);
  } catch (err) {
    if (err.response.status === 502) {
      return err;
    }
    throw err;
  }
  return redirect("/admin/signin");
}
export default ResetPassword;
