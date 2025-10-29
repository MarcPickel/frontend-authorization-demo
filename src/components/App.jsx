import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import * as auth from "../utils/auth";
import * as api from "../utils/api";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import "./styles/App.css";

import { setToken, getToken } from "../utils/token";

function App() {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }

    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        // If the response is successful, log the user in, save his
        // data to state, and navigate him to /ducks.
        setIsLoggedIn(true);
        setUserData({ username, email });
        navigate("/ducks");
      })
      .catch(console.error);
  }, []);

  const navigate = useNavigate();

  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password === confirmPassword) {
      auth
        .register(username, password, email)
        .then(() => {
          navigate("/login");
        })
        .catch(console.error);
    }
  };

  const handleLogin = ({ username, password }) => {
    if (!username || !password) {
      return;
    }

    auth
      .authorize(username, password)
      .then((data) => {
        if (data.jwt) {
          setToken(data.jwt);
          setUserData(data.user);
          setIsLoggedIn(true);
          navigate("/ducks");
        }
      })
      .catch(console.error);
  };

  return (
    <Routes>
      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to="/ducks" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/ducks"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Ducks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyProfile userData={userData} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin} />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration} />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
