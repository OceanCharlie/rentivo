import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./modules/common/Home";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import ForgotPassword from "./modules/common/ForgotPassword";
import AdminHome from "./modules/admin/AdminHome";
import OwnerHome from "./modules/user/owner/OwnerHome";
import RenterHome from "./modules/user/renter/RenterHome";

export const UserContext = createContext();

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const homePath = (user) =>
  ({ Admin: "/adminhome", Owner: "/ownerhome", Renter: "/renterhome" })[user?.type] || "/";

// Redirects visitors that are not logged in, or logged in with another role
const ProtectedRoute = ({ user, role, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.type !== role) return <Navigate to={homePath(user)} replace />;
  return children;
};

function App() {
  const [userData, setUserData] = useState(readStoredUser);

  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUserData(user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUserData(null);
  };

  return (
    <UserContext.Provider value={{ userData, userLoggedIn: !!userData, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/adminhome" element={<ProtectedRoute user={userData} role="Admin"><AdminHome /></ProtectedRoute>} />
          <Route path="/ownerhome" element={<ProtectedRoute user={userData} role="Owner"><OwnerHome /></ProtectedRoute>} />
          <Route path="/renterhome" element={<ProtectedRoute user={userData} role="Renter"><RenterHome /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
