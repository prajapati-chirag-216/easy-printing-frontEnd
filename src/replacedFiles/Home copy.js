import { Fragment, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import PromptModal from "../components/UI/PromptModal";
import { uiActions } from "../store/ui-slice";
import classes from "./Home.module.css";
import shopman from "../assets/shopman.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { Await, useLoaderData } from "react-router-dom";
import { getAccountInfo } from "../lib/api";
import store from "../store/index";

const Home = () => {
  const showPrompt = useSelector((state) => state.ui.showPrompt);
  const dispatch = useDispatch();
  const loaderData = useLoaderData();

  const removeErrorHandler = () => {
    dispatch(uiActions.showPrompt(false));
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
        <Suspense>
          <Await resolve={loaderData}>
            {(data) => {
              return (
                <Fragment>
                  <div className={classes["admin_info-div"]}>
                    <div className={classes["admin_photo-div"]}>
                      <img
                        src={shopman}
                        className={classes["admin_photo"]}
                        alt="not found"
                      />
                    </div>
                    <div className={classes["caption-div"]}>
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
                    </div>
                  </div>
                  <div className={classes["admin_status-div"]}>
                    <div className={classes["status-div"]}>
                      <div className={classes["user_status-div"]}>
                        <span className={classes["count"]}>12</span>
                        <h1>Users/month</h1>
                      </div>
                      <div className={classes["files_status-div"]}>
                        <span className={classes["count"]}>
                          {data.totalFiles}
                        </span>
                        <h1>Files/month</h1>
                      </div>
                    </div>
                    <div className={classes["status_info-div"]}>
                      <span className={classes["count"]}>
                        {data.totalUsers}
                      </span>
                      <h1>Total Users</h1>
                    </div>
                  </div>
                </Fragment>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </Fragment>
  );
};
export async function loader() {
  let response;
  try {
    const token = store.getState().auth.authToken;
    response = await getAccountInfo(token);
  } catch (err) {
    throw err;
  }
  return response;
}

export default Home;
