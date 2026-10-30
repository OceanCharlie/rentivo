import { useEffect, useState } from "react";
import { Table } from "antd";
import api, { formatDate } from "../../api";
import StatusTag from "../common/StatusTag";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/getallbookings").then((res) => {
      setBookings(res.data.data || []);
      setLoading(false);
    });
  }, []);

  const columns = [
    { title: "Tanggal", dataIndex: "createdAt", render: formatDate },
    { title: "Properti", render: (_, b) => b.propertyId?.propertyAddress || <i className="text-slate-400">Properti dihapus</i> },
    { title: "Penyewa", dataIndex: "userName" },
    { title: "Telepon", dataIndex: "phone" },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      render: (s) => <StatusTag status={s} />,
      filters: ["pending", "booked", "rejected", "cancelled"].map((s) => ({ text: s, value: s })),
      onFilter: (value, b) => b.bookingStatus === value,
    },
  ];

  return (
    <Table rowKey="_id" columns={columns} dataSource={bookings} loading={loading} scroll={{ x: true }} className="bg-white rounded-xl shadow-sm" />
  );
};

export default AllBookings;
