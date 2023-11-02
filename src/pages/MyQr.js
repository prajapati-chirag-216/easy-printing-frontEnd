import { Suspense } from "react";
import classes from "./MyQr.module.css";
import { myQr } from "../lib/api";
import store from "../store/index";
import { Await, useLoaderData } from "react-router-dom";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const MyQr = () => {
  const loaderData = useLoaderData();
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await
        resolve={loaderData.buffer_data}
        errorElement={<p className="centered">Error while loading QR!</p>}
      >
        {(qrData) => (
          <div className={classes["component"]}>
            <object
              type="application/pdf"
              data={qrData}
              className={classes.object}
            >
              <param name="view" value="fitH" />
              <p className="centereds">Unable to load Qr</p>
            </object>
          </div>
        )}
      </Await>
    </Suspense>
  );
};

export async function loader() {
  if (!store.getState().auth.isLoggedIn) {
    return "";
  }
  let response;
  try {
    response = await myQr();
  } catch (err) {
    throw err;
  }
  return response;
}
export default MyQr;
