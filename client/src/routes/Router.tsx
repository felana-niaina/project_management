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
const MyProfil = lazy(() => import("../component/MyProfil"));
const ProductOwner = lazy(() => import("../component/ProductOwner"));
const Backlog = lazy(() => import("../component/Backlog"));
const SprintPlanning = lazy(() => import("../component/SprintPlanning"));
const DashboardScrum = lazy(() => import("../component/DashboardScrum"));
const DashboardProductOwner = lazy(()=> import("../component/DashboardProductOwner"));

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
          path="/accueil/:idSprint"
          element={
            <Suspense>
              <Accueil />
            </Suspense>
          }
        />
        <Route
          path="/productOwnerDashboard"
          element={
            <Suspense>
              <ProductOwner />
            </Suspense>
          }
        />
        <Route
          path="/backlog/:id"
          element={
            <Suspense>
              <Backlog />
            </Suspense>
          }
        />
        <Route
          path="/dashboardScrum/:id"
          element={
            <Suspense>
              <DashboardScrum />
            </Suspense>
          }
        />
        <Route
          path="/DashboardProductOwner"
          element={
            <Suspense>
              <DashboardProductOwner />
            </Suspense>
          }
        />
   
        <Route
          path="/sprintPlanning/:id"
          element={
            <Suspense>
              <SprintPlanning />
            </Suspense>
          }
        />
        <Route
          path="/teams"
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
        <Route
          path="/myProfil"
          element={
            <Suspense>
              <MyProfil />
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
