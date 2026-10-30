import { useContext, useEffect, useState } from "react";
import { Result, Spin } from "antd";
import api from "../../../api";
import { UserContext } from "../../../App";
import Navbar from "../../common/Navbar";
import DashboardLayout from "../../common/DashboardLayout";
import OwnerStats from "./OwnerStats";
import AddProperty from "./AddProperty";
import AllProperties from "./AllProperties";
import AllBookings from "./AllBookings";

const OwnerHome = () => {
  const { userData, login } = useContext(UserContext);
  const [activeKey, setActiveKey] = useState("dashboard");
  const [checking, setChecking] = useState(true);

  // Refresh the granted status, the admin may have approved the owner since login
  useEffect(() => {
    api.post("/user/getuserdata").then((res) => {
      if (res.data.success) login(res.data.data);
      setChecking(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (userData.granted !== "granted") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Result
          status="info"
          title="Akun Anda menunggu persetujuan admin"
          subTitle="Setelah disetujui, Anda dapat memasang dan mengelola properti. Silakan cek kembali nanti."
        />
      </div>
    );
  }

  const tabs = [
    { key: "dashboard", label: "Dashboard", children: <OwnerStats /> },
    { key: "add", label: "Tambah Properti", children: <AddProperty onAdded={() => setActiveKey("properties")} /> },
    { key: "properties", label: "Properti Saya", children: <AllProperties /> },
    { key: "bookings", label: "Booking Masuk", children: <AllBookings /> },
  ];

  return (
    <DashboardLayout
      title="Dashboard Pemilik"
      subtitle="Kelola properti dan permintaan booking Anda."
      tabs={tabs}
      activeKey={activeKey}
      onChange={setActiveKey}
    />
  );
};

export default OwnerHome;
