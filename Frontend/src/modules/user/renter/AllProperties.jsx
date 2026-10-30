import { useEffect, useState } from "react";
import { Button, Popconfirm, Table, message } from "antd";
import api, { formatDate, formatRupiah } from "../../../api";
import StatusTag from "../../common/StatusTag";

// Booking history of the logged-in renter
const AllProperties = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBookings = async () => {
    const res = await api.get("/user/getallbookings");
    setBookings(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    const res = await api.delete(`/user/cancelbooking/${bookingId}`);
    if (res.data.success) message.success(res.data.message);
    else message.error(res.data.message);
    getAllBookings();
  };

  const columns = [
    { title: "Tanggal", dataIndex: "createdAt", render: formatDate },
    { title: "Properti", render: (_, b) => b.propertyId?.propertyAddress || <i className="text-slate-400">Properti dihapus</i> },
    { title: "Harga", render: (_, b) => (b.propertyId ? formatRupiah(b.propertyId.propertyAmt) : "-") },
    { title: "Kontak Pemilik", render: (_, b) => b.propertyId?.ownerContact || "-" },
    { title: "Nama", dataIndex: "userName" },
    { title: "Telepon", dataIndex: "phone" },
    { title: "Status", dataIndex: "bookingStatus", render: (s) => <StatusTag status={s} /> },
    {
      title: "Aksi",
      render: (_, b) =>
        b.bookingStatus === "pending" ? (
          <Popconfirm title="Batalkan booking ini?" okText="Ya" cancelText="Tidak" onConfirm={() => cancelBooking(b._id)}>
            <Button danger size="small">Batalkan</Button>
          </Popconfirm>
        ) : null,
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

export default AllProperties;
