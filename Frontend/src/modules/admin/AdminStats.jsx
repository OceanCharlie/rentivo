import { useEffect, useState } from "react";
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, HomeOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import api from "../../api";
import StatCards from "../common/StatCards";

const AdminStats = () => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/admin/getallusers").then((res) => setUsers(res.data.data || []));
    api.get("/admin/getallproperties").then((res) => setProperties(res.data.data || []));
    api.get("/admin/getallbookings").then((res) => setBookings(res.data.data || []));
  }, []);

  const count = (list, fn) => list.filter(fn).length;

  return (
    <StatCards
      stats={[
        { title: "Total Pengguna", value: users.length, icon: <TeamOutlined />, color: "bg-teal-50 text-teal-600" },
        { title: "Owner Menunggu Persetujuan", value: count(users, (u) => u.type === "Owner" && u.granted !== "granted"), icon: <UserAddOutlined />, color: "bg-orange-50 text-orange-600" },
        { title: "Properti Tersedia", value: count(properties, (p) => p.isAvailable === "Available"), icon: <HomeOutlined />, color: "bg-green-50 text-green-600" },
        { title: "Properti Dibooking", value: count(properties, (p) => p.isAvailable === "Booked"), icon: <CheckCircleOutlined />, color: "bg-sky-50 text-sky-600" },
        { title: "Booking Menunggu", value: count(bookings, (b) => b.bookingStatus === "pending"), icon: <ClockCircleOutlined />, color: "bg-amber-50 text-amber-600" },
        { title: "Booking Dikonfirmasi", value: count(bookings, (b) => b.bookingStatus === "booked"), icon: <CalendarOutlined />, color: "bg-emerald-50 text-emerald-600" },
      ]}
    />
  );
};

export default AdminStats;
