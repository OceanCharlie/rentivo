import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import api from "../../api";
import AuthLayout from "./AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestCode = async (values) => {
    setLoading(true);
    const res = await api.post("/user/forgotpassword/request", values);
    setLoading(false);
    if (res.data.success) {
      message.success(res.data.message);
      setEmail(values.email);
    } else {
      message.error(res.data.message);
    }
  };

  const resetPassword = async (values) => {
    setLoading(true);
    const res = await api.post("/user/forgotpassword/reset", { email, otp: values.otp, password: values.password });
    setLoading(false);
    if (res.data.success) {
      message.success(res.data.message);
      navigate("/login");
    } else {
      message.error(res.data.message);
    }
  };

  return (
    <AuthLayout
      title="Lupa password"
      subtitle={email ? `Masukkan kode 6 digit yang dikirim ke ${email}.` : "Kami akan mengirim kode reset ke email Anda."}
    >
      {!email ? (
        <Form layout="vertical" onFinish={requestCode} requiredMark={false} size="large">
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Masukkan email yang valid" }]}>
            <Input placeholder="nama@email.com" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Kirim Kode
          </Button>
        </Form>
      ) : (
        <Form layout="vertical" onFinish={resetPassword} requiredMark={false} size="large">
          <Form.Item name="otp" label="Kode Reset" rules={[{ required: true, len: 6, message: "Kode terdiri dari 6 digit" }]}>
            <Input.OTP length={6} />
          </Form.Item>
          <Form.Item name="password" label="Password Baru" rules={[{ required: true, min: 6, message: "Password minimal 6 karakter" }]}>
            <Input.Password placeholder="Minimal 6 karakter" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Reset Password
          </Button>
          <Button type="link" block onClick={() => setEmail(null)} className="mt-2">
            Ganti email / kirim ulang kode
          </Button>
        </Form>
      )}
      <p className="mt-6 text-center text-slate-500">
        Ingat password? <Link to="/login" className="text-teal-700 font-medium">Login</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
