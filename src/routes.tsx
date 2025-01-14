import Layout from "./layout";
import { Route, createRoutesFromElements } from "react-router-dom";
import React from "react";
// Pages import
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import Dashboard from "./pages/admin/Dashboard";
// import QuestionSet from "./pages/admin/QuestionSet";
// import Aptitude from "./pages/admin/Aptitude";
// import AppearAptitude from "./pages/Aptitude/AppearAptitude";
// import AptitudeResult from "./pages/Aptitude/AptitudeResult";
// import Aptitudes from "./pages/Aptitude/Aptitudes";
// import ForgotPass from "./pages/Login/ForgotPass";

//  import lazily

const Dashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const QuestionSet = React.lazy(() => import("./pages/admin/QuestionSet"));
const Aptitude = React.lazy(() => import("./pages/admin/Aptitude"));
const AppearAptitude = React.lazy(() => import("./pages/Aptitude/AppearAptitude"));
const AptitudeResult = React.lazy(() => import("./pages/Aptitude/AptitudeResult"));
const Aptitudes = React.lazy(() => import("./pages/Aptitude/Aptitudes"));
const ForgotPass = React.lazy(() => import("./pages/Login/ForgotPass"));


const Routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    {/* Routes for different pages */}
    <Route path="" element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Signup />} />
    <Route path="forgot-password" element={<ForgotPass />}></Route>

    {/*Admin Routes  */}
    <Route path="admin/aptitudes" element={<Dashboard />} />
    <Route path="admin/questions" element={<QuestionSet />} />
    <Route path="admin/aptitude/:id" element={<Aptitude />} />

    {/* User Routes */}
    <Route path="/aptitudes" element={<Aptitudes />}></Route>
    <Route path="/aptitude/appear/:id" element={<AppearAptitude />}></Route>
    <Route path="/aptitude/response/:id" element={<AptitudeResult />} />
  </Route>
);

export default Routes;
