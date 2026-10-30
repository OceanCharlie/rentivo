import { useEffect, useState } from "react";
import { Button, Space, Table, message } from "antd";
import api, { formatDate } from "../../../api";
import StatusTag from "../../common/StatusTag";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBookings = async () => {
    const res = await api.get("/owner/getallbookings");
    setBookings(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  const handleStatus = async (bookingId, status) => {
    const res = await api.post("/owner/handlebookingstatus", { bookingId, status });
    if (res.data.success) message.success(res.data.message);
    else message.error(res.data.message);
    getAllBookings();
  };

  const columns = [
    { title: "Tanggal", dataIndex: "createdAt", render: formatDate },
    { title: "Properti", render: (_, b) => b.propertyId?.propertyAddress || <i className="text-slate-400">Properti dihapus</i> },
    { title: "Penyewa", dataIndex: "userName" },
    { title: "Telepon", dataIndex: "phone" },
    { title: "Status", dataIndex: "bookingStatus", render: (s) => <StatusTag status={s} /> },
    {
      title: "Aksi",
      render: (_, b) => {
        if (!b.propertyId || ["cancelled", "rejected"].includes(b.bookingStatus)) return null;
        return b.bookingStatus === "pending" ? (
          <Space>
            <Button size="small" type="primary" onClick={() => handleStatus(b._id, "booked")}>Konfirmasi</Button>
            <Button size="small" danger onClick={() => handleStatus(b._id, "rejected")}>Tolak</Button>
          </Space>
        ) : (
          <Button size="small" onClick={() => handleStatus(b._id, "pending")}>Kembalikan ke Pending</Button>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={bookings}
      loading={loading}
      scroll={{ x: true }}
      locale={{ emptyText: "Belum ada booking" }}
      className="bg-white rounded-xl shadow-sm"
    />
  );
};

export default AllBookings;
