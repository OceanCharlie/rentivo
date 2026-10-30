import { useEffect, useState } from "react";
import { Table } from "antd";
import api, { formatDate, formatRupiah } from "../../api";
import StatusTag from "../common/StatusTag";
import { AD_LABEL, PropertyImage, TYPE_LABEL } from "../user/AllPropertiesCards";

const AllProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/getallproperties").then((res) => {
      setProperties(res.data.data || []);
      setLoading(false);
    });
  }, []);

  const columns = [
    { title: "Foto", render: (_, p) => <PropertyImage property={p} className="w-20 h-14 rounded" /> },
    { title: "Alamat", dataIndex: "propertyAddress" },
    { title: "Pemilik", dataIndex: "ownerName" },
    { title: "Tipe", render: (_, p) => `${TYPE_LABEL[p.propertyType]} · ${AD_LABEL[p.propertyAdType]}` },
    { title: "Harga", dataIndex: "propertyAmt", render: formatRupiah, sorter: (a, b) => a.propertyAmt - b.propertyAmt },
    { title: "Status", dataIndex: "isAvailable", render: (s) => <StatusTag status={s} /> },
    { title: "Dibuat", dataIndex: "createdAt", render: formatDate },
  ];

  return (
    <Table rowKey="_id" columns={columns} dataSource={properties} loading={loading} scroll={{ x: true }} className="bg-white rounded-xl shadow-sm" />
  );
};

export default AllProperty;
