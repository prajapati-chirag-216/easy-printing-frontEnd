import { Fragment } from "react";
import { Outlet, useLocation } from "react-router-dom";
import classes from "./Layout.module.css";
import MainNavigation from "../components/layout/MainNavigation";
import { useSelector } from "react-redux";
import shopman from "../assets/shopman.jpg";

const Layout = () => {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Fragment>
      <MainNavigation />
      <div
        className={
          location.pathname.startsWith("/admin") ? classes.container : ""
        }
      >
        {location.pathname.startsWith("/admin") && (
          <div className={`${classes["img-div"]}`}>
            <img src={shopman} alt="red" />
          </div>
        )}
        <div
          className={
            location.pathname.startsWith("/admin") ? classes["form-div"] : ""
          }
        >
          {!location.pathname.startsWith("/user") && (
            <main
              className={
                !isLoggedIn || location.pathname.startsWith("/success")
                  ? classes.main
                  : classes["content-div"]
              }
            >
              <Outlet />
            </main>
          )}
          {location.pathname.startsWith("/user") && (
            <main className={classes["content-div"]}>
              <Outlet />
            </main>
          )}
        </div>
      </div>
    </Fragment>
  );
};
export default Layout;
