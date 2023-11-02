import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { uiActions } from "../store/ui-slice";

const ProtectedRoutes = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { pathname } = location;

  useEffect(() => {
    if (isLoggedIn && pathname === "/admin/signin") {
      dispatch(uiActions.showPrompt(true));
    }
  }, [pathname, dispatch]);

  const element = <Navigate to={props.destination} replace />;
  return props.indexPage ? (
    !isLoggedIn ? (
      <Outlet />
    ) : (
      element
    )
  ) : isLoggedIn ? (
    <Outlet />
  ) : (
    element
  );
};
export default ProtectedRoutes;
