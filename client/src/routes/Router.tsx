import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "../common/ProtectedRoute";

const Login = lazy(
  () => import("../component/Authentification/Authentification")
);
const Layout = lazy(() => import("../common/Layout"));

const Accueil = lazy(() => import("../component/Accueil"));
const Formulaire = lazy(() => import("../component/Formulaire"));
const Users = lazy(() => import("../component/Users"));

const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense>
            <Login />
          </Suspense>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/accueil"
          element={
            <Suspense>
              <Accueil />
            </Suspense>
          }
        />
        <Route
          path="/formulaire"
          element={
            <Suspense>
              <Formulaire />
            </Suspense>
          }
        />
        <Route
          path="/users"
          element={
            <Suspense>
              <Formulaire />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/createUsers"
        element={
          <Suspense>
            <Users />
          </Suspense>
        }
      />
    </Routes>
  );
};
export default Router;
