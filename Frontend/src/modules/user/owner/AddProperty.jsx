import { useState } from "react";
import { Button, Card, Form, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import api from "../../../api";
import PropertyForm, { toFormData } from "./PropertyForm";

const initialValues = { propertyType: "residential", propertyAdType: "rent", propertyAmt: 0 };

const AddProperty = ({ onAdded }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (fileList.length === 0) {
      message.error("Unggah minimal 1 foto properti");
      return;
    }
    setLoading(true);
    const res = await api.post("/owner/postproperty", toFormData(values, "propertyImages", fileList));
    setLoading(false);

    if (res.data.success) {
      message.success(res.data.message);
      form.resetFields();
      setFileList([]);
      onAdded?.();
    } else {
      message.error(res.data.message);
    }
  };

  return (
    <Card variant="borderless" className="shadow-sm max-w-3xl">
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit} requiredMark={false}>
        <PropertyForm />
        <Form.Item label="Foto Properti (maks. 6, @5MB)">
          <Upload.Dragger
            multiple
            accept="image/*"
            listType="picture"
            maxCount={6}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList: list }) => setFileList(list)}
          >
            <p className="text-3xl text-teal-600"><InboxOutlined /></p>
            <p>Klik atau seret foto ke sini</p>
          </Upload.Dragger>
        </Form.Item>
        <div className="text-right">
          <Button type="primary" htmlType="submit" loading={loading}>
            Simpan Properti
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AddProperty;
