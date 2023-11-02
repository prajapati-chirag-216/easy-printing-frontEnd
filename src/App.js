import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Signup, { action as newAdminAction } from "./pages/Signup";
import Signin, { action as signinAdminAction } from "./pages/Signin";
import ForgotPassword, {
  action as forgotPasswordAction,
} from "./pages/ForgotPassword";
import Home, {
  loader as infoLoader,
  action as updateImageAction,
} from "./pages/Home";
import ResetPassword, {
  action as resetPasswordAction,
} from "./pages/ResetPassword";
import Layout from "./pages/Layout";
import Error from "./components/error/Error";
import Success from "./pages/Success";
import MyQr, { loader as qrLoader } from "./pages/MyQr";
import ShowFiles from "./pages/ShowFiles";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";
import User, { action as uploadFileAction } from "./pages/User";
import UserFiles, { loader as userFileLoader } from "./pages/UserFiles";
import FilesToPrint from "./pages/FilesToPrint";
import MapContainer, { action as mapAction } from "./pages/MapContainer";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<Error />}>
      <Route
        path="/"
        element={<ProtectedRoutes destination="/home" indexPage={true} />}
      >
        <Route index element={<Navigate to="admin" />} />
        <Route
          path="/admin/signin"
          element={<Signin />}
          action={signinAdminAction}
        />
      </Route>
      <Route path="/admin" element={<Signup />} action={newAdminAction} />
      <Route
        path="/admin/forgotPassword"
        element={<ForgotPassword />}
        action={forgotPasswordAction}
      />
      <Route
        element={
          <PrivateRoutes message="Access denied! You don't have permissions for this page." />
        }
      >
        <Route path="/success" element={<Success />} />
      </Route>
      <Route
        path="/admin/resetPassword/:tokenId"
        element={<ResetPassword />}
        action={resetPasswordAction}
      />
      <Route element={<ProtectedRoutes from="2nd" destination="admin" />}>
        <Route
          path="/home"
          element={<Home />}
          loader={infoLoader}
          action={updateImageAction}
        />
        <Route path="/myQr" element={<MyQr />} loader={qrLoader} />
        <Route path="/showFiles" element={<ShowFiles />} />
      </Route>
      <Route path="/user/:qrId" element={<User />} action={uploadFileAction} />
      <Route
        path="/user/:qrId/files"
        element={<UserFiles />}
        loader={userFileLoader}
      />
      <Route path="/filesToPrint" element={<FilesToPrint />} />
      <Route path="/user/map" element={<MapContainer />} action={mapAction} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
