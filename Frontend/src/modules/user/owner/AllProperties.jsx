import { useEffect, useState } from "react";
import { Button, Form, Modal, Popconfirm, Space, Table, Upload, message } from "antd";
import { DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import api, { formatRupiah } from "../../../api";
import StatusTag from "../../common/StatusTag";
import { AD_LABEL, PropertyImage, TYPE_LABEL } from "../AllPropertiesCards";
import PropertyForm, { toFormData } from "./PropertyForm";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const getAllProperties = async () => {
    const res = await api.get("/owner/getallproperties");
    setProperties(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const openEdit = (property) => {
    setEditing(property);
    setFileList([]);
    form.setFieldsValue(property);
  };

  const handleUpdate = async (values) => {
    setSaving(true);
    const res = await api.patch(`/owner/updateproperty/${editing._id}`, toFormData(values, "propertyImage", fileList));
    setSaving(false);
    if (res.data.success) {
      message.success(res.data.message);
      setEditing(null);
      getAllProperties();
    } else {
      message.error(res.data.message);
    }
  };

  const handleDelete = async (propertyId) => {
    const res = await api.delete(`/owner/deleteproperty/${propertyId}`);
    if (res.data.success) message.success(res.data.message);
    else message.error(res.data.message);
    getAllProperties();
  };

  const columns = [
    { title: "Foto", render: (_, p) => <PropertyImage property={p} className="w-20 h-14 rounded" /> },
    { title: "Alamat", dataIndex: "propertyAddress" },
    { title: "Tipe", render: (_, p) => `${TYPE_LABEL[p.propertyType]} · ${AD_LABEL[p.propertyAdType]}` },
    { title: "Harga", dataIndex: "propertyAmt", render: formatRupiah },
    { title: "Kontak", dataIndex: "ownerContact" },
    { title: "Status", dataIndex: "isAvailable", render: (s) => <StatusTag status={s} /> },
    {
      title: "Aksi",
      render: (_, p) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(p)}>Edit</Button>
          <Popconfirm title="Hapus properti ini?" okText="Hapus" cancelText="Batal" onConfirm={() => handleDelete(p._id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={properties}
        loading={loading}
        scroll={{ x: true }}
        locale={{ emptyText: "Belum ada properti" }}
        className="bg-white rounded-xl shadow-sm"
      />
      <Modal
        open={!!editing}
        title="Edit Properti"
        onCancel={() => setEditing(null)}
        onOk={() => form.submit()}
        okText="Simpan"
        cancelText="Batal"
        confirmLoading={saving}
        width={720}
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate} requiredMark={false}>
          <PropertyForm />
          <Form.Item label="Ganti Foto (opsional, menggantikan semua foto lama)">
            <Upload
              accept="image/*"
              maxCount={1}
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: list }) => setFileList(list)}
            >
              <Button icon={<UploadOutlined />}>Pilih Foto</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AllProperties;
