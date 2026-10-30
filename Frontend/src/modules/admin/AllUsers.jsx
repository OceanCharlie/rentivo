import { useEffect, useState } from "react";
import { Button, Table, Tag, message } from "antd";
import api, { formatDate } from "../../api";
import StatusTag from "../common/StatusTag";

const TYPE_COLOR = { Admin: "purple", Owner: "blue", Renter: "cyan" };

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllUsers = async () => {
    const res = await api.get("/admin/getallusers");
    setUsers(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleStatus = async (userid, status) => {
    const res = await api.post("/admin/handlestatus", { userid, status });
    if (res.data.success) message.success(res.data.message);
    else message.error(res.data.message);
    getAllUsers();
  };

  const columns = [
    { title: "Nama", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Tipe",
      dataIndex: "type",
      render: (t) => <Tag color={TYPE_COLOR[t]}>{t}</Tag>,
      filters: ["Admin", "Owner", "Renter"].map((t) => ({ text: t, value: t })),
      onFilter: (value, u) => u.type === value,
    },
    { title: "Status", render: (_, u) => (u.type === "Owner" ? <StatusTag status={u.granted} /> : "-") },
    { title: "Terdaftar", dataIndex: "createdAt", render: formatDate },
    {
      title: "Aksi",
      render: (_, u) =>
        u.type === "Owner" &&
        (u.granted === "granted" ? (
          <Button size="small" danger onClick={() => handleStatus(u._id, "ungranted")}>Cabut Akses</Button>
        ) : (
          <Button size="small" type="primary" onClick={() => handleStatus(u._id, "granted")}>Setujui</Button>
        )),
    },
  ];

  return (
    <Table rowKey="_id" columns={columns} dataSource={users} loading={loading} scroll={{ x: true }} className="bg-white rounded-xl shadow-sm" />
  );
};

export default AllUsers;
