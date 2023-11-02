import { Fragment, Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PromptModal from "../components/UI/PromptModal";
import { uiActions } from "../store/ui-slice";
import classes from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Await, useLoaderData } from "react-router-dom";
import { getAccountInfo, updateImage } from "../lib/api";
import { useSubmit } from "react-router-dom";
import store from "../store/index";

const Home = () => {
  const submit = useSubmit();
  const showPrompt = useSelector((state) => state.ui.showPrompt);
  const dispatch = useDispatch();
  const loaderData = useLoaderData();
  const imageInputRef = useRef();

  const removeErrorHandler = () => {
    dispatch(uiActions.showPrompt(false));
  };
  const updateImageHandler = (event) => {
    const formData = new FormData();
    formData.append("image", event.target.files[0]);
    submit(formData, {
      method: "post",
      action: "/home",
      encType: "multipart/form-data",
    });
  };
  return (
    <Fragment>
      {showPrompt && (
        <PromptModal
          title="You are already logged in."
          message="don't need to login again"
          onConfirm={removeErrorHandler}
        />
      )}
      <div className={classes.container}>
        <div className={classes["admin_info-div"]}>
          <div className={classes.options}>
            <label htmlFor="edit">
              <FontAwesomeIcon className={classes["fa-edit"]} icon={faEdit} />
            </label>
            <input
              ref={imageInputRef}
              id="edit"
              name="image"
              type="file"
              accept="image/*"
              onChange={updateImageHandler}
            />
          </div>
          <div className={classes["admin_photo-div"]}>
            <Suspense fallback={<p className="center"> loading</p>}>
              <Await resolve={loaderData}>
                {(data) => (
                  <img
                    src={`data:image/png;base64,${data.profilePhoto}`}
                    className={classes["admin_photo"]}
                    alt="not found"
                    width="10px"
                    height="100px"
                  />
                )}
              </Await>
            </Suspense>
          </div>
          <div className={classes["caption-div"]}>
            <Suspense>
              <Await resolve={loaderData}>
                {(data) => (
                  <Fragment>
                    <p>
                      <FontAwesomeIcon
                        icon={faUser}
                        className={classes["fa-glob"]}
                      />{" "}
                      {data.shopName}
                    </p>
                    <p>
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className={classes["fa-glob"]}
                      />{" "}
                      {data.email}
                    </p>
                  </Fragment>
                )}
              </Await>
            </Suspense>
          </div>
        </div>
        <div className={classes["admin_status-div"]}>
          <div className={classes["status-div"]}>
            <div className={classes["user_status-div"]}>
              <Suspense>
                <Await resolve={loaderData}>
                  {(data) => <span className={classes["count"]}>12</span>}
                </Await>
              </Suspense>
              <h1>Users/month</h1>
            </div>
            <div className={classes["files_status-div"]}>
              <Suspense>
                <Await
                  resolve={loaderData}
                  fallback={<p className="center"> loading</p>}
                >
                  {(data) => (
                    <span className={classes["count"]}>{data.totalFiles}</span>
                  )}
                </Await>
              </Suspense>
              <h1>Files/month</h1>
            </div>
          </div>
          <div className={classes["status_info-div"]}>
            <Suspense>
              <Await resolve={loaderData}>
                {(data) => (
                  <span className={classes["count"]}>{data.totalUsers}</span>
                )}
              </Await>
            </Suspense>

            <h1>Total Users</h1>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export async function loader() {
  if (!store.getState().auth.isLoggedIn) {
    return "";
  }
  let response;
  try {
    response = await getAccountInfo();
  } catch (err) {
    throw err;
  }
  return response;
}

export async function action({ request }) {
  let response;
  const formData = await request.formData();
  const image = formData.get("image");
  try {
    response = await updateImage(image);
  } catch (err) {
    throw err;
  }
  return response;
}

export default Home;
