import { useState } from "react";
import DashboardLayout from "../common/DashboardLayout";
import AdminStats from "./AdminStats";
import AllUsers from "./AllUsers";
import AllProperty from "./AllProperty";
import AllBookings from "./AllBookings";

const AdminHome = () => {
  const [activeKey, setActiveKey] = useState("dashboard");

  const tabs = [
    { key: "dashboard", label: "Dashboard", children: <AdminStats /> },
    { key: "users", label: "Pengguna", children: <AllUsers /> },
    { key: "properties", label: "Properti", children: <AllProperty /> },
    { key: "bookings", label: "Booking", children: <AllBookings /> },
  ];

  return (
    <DashboardLayout
      title="Dashboard Admin"
      subtitle="Pantau pengguna, properti, dan booking di Rentivo."
      tabs={tabs}
      activeKey={activeKey}
      onChange={setActiveKey}
    />
  );
};

export default AdminHome;
