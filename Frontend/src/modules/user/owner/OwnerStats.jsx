import { useEffect, useState } from "react";
import { CheckCircleOutlined, ClockCircleOutlined, HomeOutlined, LockOutlined, CalendarOutlined } from "@ant-design/icons";
import api from "../../../api";
import StatCards from "../../common/StatCards";

const OwnerStats = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/owner/getallproperties").then((res) => setProperties(res.data.data || []));
    api.get("/owner/getallbookings").then((res) => setBookings(res.data.data || []));
  }, []);

  const count = (list, key, value) => list.filter((item) => item[key] === value).length;

  return (
    <StatCards
      stats={[
        { title: "Total Properti", value: properties.length, icon: <HomeOutlined />, color: "bg-brand-50 text-brand-600" },
        { title: "Properti Tersedia", value: count(properties, "isAvailable", "Available"), icon: <CheckCircleOutlined />, color: "bg-green-50 text-green-600" },
        { title: "Properti Dibooking", value: count(properties, "isAvailable", "Booked"), icon: <LockOutlined />, color: "bg-orange-50 text-orange-600" },
        { title: "Total Booking", value: bookings.length, icon: <CalendarOutlined />, color: "bg-sky-50 text-sky-600" },
        { title: "Booking Menunggu", value: count(bookings, "bookingStatus", "pending"), icon: <ClockCircleOutlined />, color: "bg-amber-50 text-amber-600" },
        { title: "Booking Dikonfirmasi", value: count(bookings, "bookingStatus", "booked"), icon: <CheckCircleOutlined />, color: "bg-emerald-50 text-emerald-600" },
      ]}
    />
  );
};

export default OwnerStats;
