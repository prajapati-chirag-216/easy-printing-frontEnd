import { userFiles } from "../lib/api";
import store from "../store/index";
import { Suspense, useState } from "react";
import { useLoaderData, Await } from "react-router-dom";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import classes from "./UserFiles.module.css";
import FileData from "../components/files/FileData";

const UserFiles = () => {
  const loaderData = useLoaderData();
  const [index, setIndex] = useState(0);
  const showPdfHandler = (fileIndex) => {
    setIndex(fileIndex);
  };
  if (loaderData.isEmpty) {
    return <p className="centered"> No Files Chosen! </p>;
  }
  return (
    <div className={classes.component}>
      <FileData
        onShowPdf={showPdfHandler}
        loaderData={loaderData}
        index={index}
      />
      <Suspense
        fallback={
          <div className="centered">
            <LoadingSpinner />
          </div>
        }
      >
        <Await
          resolve={loaderData}
          errorElement={<p className="centered">Error while loading files!</p>}
        >
          {(userFiles) => {
            return (
              <object
                type="application/pdf"
                data={userFiles[index].file}
                className={classes.object}
              >
                <p className="centered">
                  Unable to load File.Make sure network conectivity is good.
                </p>
              </object>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
};

export async function loader() {
  let response;
  try {
    const token = store.getState().ui.isUploaded;
    if (!token) {
      return { isEmpty: true };
    }
    response = await userFiles();
  } catch (err) {
    throw err;
  }
  return response;
}
export default UserFiles;
