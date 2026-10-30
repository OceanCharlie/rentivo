import { useContext, useState } from "react";
import { UserContext } from "../../../App";
import DashboardLayout from "../../common/DashboardLayout";
import AllPropertiesCards from "../AllPropertiesCards";
import AllProperties from "./AllProperties";

const RenterHome = () => {
  const { userData } = useContext(UserContext);
  const [activeKey, setActiveKey] = useState("properties");

  const tabs = [
    { key: "properties", label: "Cari Properti", children: <AllPropertiesCards loggedIn /> },
    { key: "bookings", label: "Riwayat Booking", children: <AllProperties /> },
  ];

  return (
    <DashboardLayout
      title={`Halo, ${userData.name}`}
      subtitle="Temukan properti dan pantau status booking Anda."
      tabs={tabs}
      activeKey={activeKey}
      onChange={setActiveKey}
    />
  );
};

export default RenterHome;
