import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const PrivateRoutes = (props) => {
  const isSuccess = useSelector((state) => state.ui.isSuccess);
  try {
    if (isSuccess) {
      return <Outlet />;
    }
    throw { message: props.message, status: 404 };
  } catch (err) {
    throw err;
  }
};
export default PrivateRoutes;
