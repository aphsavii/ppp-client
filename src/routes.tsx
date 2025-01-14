import Layout from "./layout";
import { Route, createRoutesFromElements } from "react-router-dom";

// Pages import
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/admin/Dashboard";
import QuestionSet from "./pages/admin/QuestionSet";
import Aptitude from "./pages/admin/Aptitude";
import AppearAptitude from "./pages/Aptitude/AppearAptitude";
import AptitudeResult from "./pages/Aptitude/AptitudeResult";
import Aptitudes from "./pages/Aptitude/Aptitudes";
import ForgotPass from "./pages/Login/ForgotPass";

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
