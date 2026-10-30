import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import api from "../../api";
import { UserContext, homePath } from "../../App";

export const Logo = ({ className = "h-9" }) => (
  <Link to="/" className="inline-flex items-center">
    <img src="/logo.png" alt="Rentivo" className={`${className} w-auto`} />
  </Link>
);

const Navbar = () => {
  const { userData, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post("/user/logout");
    logout();
    message.success("Berhasil logout");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          {userData ? (
            <>
              <Link to={homePath(userData)} className="hidden sm:block text-slate-600 hover:text-brand-700">
                Halo, <b>{userData.name}</b> ({userData.type})
              </Link>
              <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-700 hover:text-brand-700 font-medium px-2">
                Login
              </Link>
              <Link to="/register">
                <Button type="primary">Daftar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
