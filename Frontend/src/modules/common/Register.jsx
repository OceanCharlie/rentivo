import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Radio, message } from "antd";
import api from "../../api";
import AuthLayout from "./AuthLayout";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const res = await api.post("/user/register", values);
    setLoading(false);

    if (res.data.success) {
      message.success(
        values.type === "Owner"
          ? "Registrasi berhasil. Akun owner menunggu persetujuan admin."
          : res.data.message
      );
      navigate("/login");
    } else {
      message.error(res.data.message);
    }
  };

  return (
    <AuthLayout title="Buat akun baru" subtitle="Daftar sebagai penyewa atau pemilik properti.">
      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} size="large" initialValues={{ type: "Renter" }}>
        <Form.Item name="name" label="Nama Lengkap" rules={[{ required: true, message: "Masukkan nama" }]}>
          <Input placeholder="Nama Anda" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Masukkan email yang valid" }]}>
          <Input placeholder="nama@email.com" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: "Password minimal 6 karakter" }]}>
          <Input.Password placeholder="Minimal 6 karakter" />
        </Form.Item>
        <Form.Item name="type" label="Daftar sebagai">
          <Radio.Group optionType="button" buttonStyle="solid" className="w-full flex">
            <Radio.Button value="Renter" className="flex-1 text-center">Penyewa</Radio.Button>
            <Radio.Button value="Owner" className="flex-1 text-center">Pemilik</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Daftar
        </Button>
      </Form>
      <p className="mt-6 text-center text-slate-500">
        Sudah punya akun? <Link to="/login" className="text-teal-700 font-medium">Login</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
