import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import api from "../../api";
import { UserContext, homePath } from "../../App";
import AuthLayout from "./AuthLayout";

const Login = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const res = await api.post("/user/login", values);
    setLoading(false);

    if (res.data.success) {
      login(res.data.user);
      message.success(res.data.message);
      navigate(homePath(res.data.user));
    } else {
      message.error(res.data.message);
    }
  };

  return (
    <AuthLayout title="Masuk ke Rentivo" subtitle="Selamat datang kembali! Silakan login ke akun Anda.">
      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} size="large">
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Masukkan email yang valid" }]}>
          <Input placeholder="nama@email.com" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: "Masukkan password" }]}>
          <Input.Password placeholder="••••••" />
        </Form.Item>
        <div className="text-right -mt-2 mb-4">
          <Link to="/forgotpassword" className="text-teal-700">Lupa password?</Link>
        </div>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Login
        </Button>
      </Form>
      <p className="mt-6 text-center text-slate-500">
        Belum punya akun? <Link to="/register" className="text-teal-700 font-medium">Daftar</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
