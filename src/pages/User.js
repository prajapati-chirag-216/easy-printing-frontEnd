import { useRef, useReducer, useState, useEffect } from "react";
import { Form, useActionData } from "react-router-dom";
import Input from "../components/input/Input";
import { nameReducer, fileReducer } from "../components/reducers/InputReducers";
import classes from "./action.module.css";
import Button from "../components/Button/Button";
import { useParams } from "react-router-dom";
import { deleteUser, uploadFiles } from "../lib/api";
import { uiActions } from "../store/ui-slice";
import store from "../store";
import { useDispatch } from "react-redux";
import Notification from "../components/UI/Notification";

const User = () => {
  const nameInputRef = useRef();
  const fileInputRef = useRef();

  // async function handleWindowClose() {
  //   alert("doy you want to close");
  //   try {
  //     await deleteUser();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  // window.addEventListener("beforeunload", handleWindowClose);
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = (e) => {
    e.preventDefault();
    const message =
      "Are you sure you want to leave? All provided data will be lost.";
    e.returnValue = message;
    return message;
  };

  const dispatch = useDispatch();

  const [formIsValid, setFormIsValid] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [nameState, dispatchName] = useReducer(nameReducer, {
    value: "",
    isValid: null,
  });
  const [fileState, dispatchFile] = useReducer(fileReducer, {
    value: "",
    isValid: null,
  });

  const { isValid: nameIsValid } = nameState;
  const { isValid: fileIsValid } = fileState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(nameIsValid && fileIsValid);
    }, 500);

    return () => clearTimeout(identifier);
  }, [nameIsValid, fileIsValid]);

  const nameChangeHandler = (event) => {
    dispatchName({ type: "USER_INPUT", val: event.target.value });
  };
  const fileChangeHandler = (event) => {
    dispatchFile({ type: "USER_INPUT", val: event.target.files });
  };
  const validateNameHandler = () => {
    dispatchName({ type: "INPUT_BLUR" });
  };

  const validateFormHandler = (event) => {
    event.preventDefault();
    if (!nameIsValid) {
      nameInputRef.current.focus();
    } else {
      fileInputRef.current.focus();
    }
  };

  useEffect(() => {
    dispatch(uiActions.loginUser(true));
  }, []);

  const params = useParams();
  const actionData = useActionData();

  useEffect(() => {
    if (actionData && actionData.success) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 4000);
      dispatchName({ type: "RESET" });
      document.getElementsByClassName("form-action")[0].reset();
    }
  }, [actionData]);

  return (
    <div className={classes.action}>
      {showNotification && (
        <Notification
          title="Success."
          message="Your files are successfully uploaded"
        />
      )}
      <Form
        method="post"
        action={`/user/${params.qrId}`}
        encType="multipart/form-data"
        className="form-action"
      >
        <Input
          ref={nameInputRef}
          label="Name"
          type="text"
          id="name"
          value={nameState.value}
          onChange={nameChangeHandler}
          onBlur={validateNameHandler}
          isValid={nameIsValid}
        />
        <Input
          ref={fileInputRef}
          label="Files"
          type="file"
          id="files"
          onChange={fileChangeHandler}
        />
        <div className={classes.actions}>
          <Button
            type="submit"
            onClick={!formIsValid ? validateFormHandler : () => {}}
          >
            Upload Files
          </Button>
        </div>
      </Form>
    </div>
  );
};

export async function action({ request, params }) {
  let response;
  const formData = await request.formData();
  const user = {
    name: formData.get("name"),
    files: formData.getAll("files"),
    id: params.qrId,
  };
  console.log(user);
  try {
    response = await uploadFiles(user);
  } catch (err) {
    if (err.response.status === 502) {
      return err;
    }
    throw err;
  }
  store.dispatch(uiActions.isUploaded(true));
  return response;
}
export default User;
