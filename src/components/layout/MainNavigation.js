import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faHome } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { logoutAdmin } from "../../lib/api";

const MainNavigation = () => {
  const params = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userLoggedIn = useSelector((state) => state.ui.userLoggedIn);
  const dispatch = useDispatch();

  const logoutAdminHandler = async () => {
    if (isLoggedIn) {
      dispatch(authActions.logout());
      try {
        await logoutAdmin();
      } catch (err) {
        throw err;
      }
    }
    navigate("/admin/signin", { replace: true });
  };
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <FontAwesomeIcon
          icon={faPrint}
          className={classes["fa-globe"]}
        ></FontAwesomeIcon>{" "}
        Easy Printing
      </div>
      <nav className={classes.nav}>
        {isLoggedIn && !userLoggedIn && (
          <ul>
            <li>
              <NavLink
                to="/home"
                className={(navdata) =>
                  navdata.isActive ? classes.active : ""
                }
              >
                <FontAwesomeIcon icon={faHome} />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/showFiles"
                className={(navdata) =>
                  navdata.isActive ? classes.active : ""
                }
              >
                Show Files
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/myQr"
                className={(navdata) =>
                  navdata.isActive ? classes.active : ""
                }
              >
                My QR
              </NavLink>
            </li>
            <li>
              <button onClick={logoutAdminHandler}>Logout</button>
            </li>
          </ul>
        )}
        {userLoggedIn && (
          <ul>
            <li>
              <NavLink
                to={`/user/${params.qrId}`}
                className={(navdata) =>
                  navdata.isActive ? classes.active : ""
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/user/${params.qrId}/files`}
                className={(navdata) =>
                  navdata.isActive ? classes.active : ""
                }
              >
                Show Files
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/user/map`}
                className={(navdata) =>
                  navdata.isActive ? classes.active : ""
                }
              >
                Map
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default MainNavigation;
