import { Form, Input, InputNumber, Select } from "antd";

// Shared fields for adding and editing a property
const PropertyForm = () => (
  <>
    <div className="grid md:grid-cols-2 gap-x-4">
      <Form.Item name="propertyType" label="Tipe Properti" rules={[{ required: true }]}>
        <Select
          options={[
            { value: "residential", label: "Hunian" },
            { value: "commercial", label: "Komersial" },
            { value: "land/plot", label: "Tanah" },
          ]}
        />
      </Form.Item>
      <Form.Item name="propertyAdType" label="Jenis Iklan" rules={[{ required: true }]}>
        <Select options={[{ value: "rent", label: "Disewa" }, { value: "sale", label: "Dijual" }]} />
      </Form.Item>
    </div>
    <Form.Item name="propertyAddress" label="Alamat Lengkap" rules={[{ required: true, message: "Masukkan alamat" }]}>
      <Input placeholder="Jl. Contoh No. 1, Kota" />
    </Form.Item>
    <div className="grid md:grid-cols-2 gap-x-4">
      <Form.Item
        name="ownerContact"
        label="No. Kontak"
        rules={[{ required: true, pattern: /^[0-9+\-\s]{8,15}$/, message: "Nomor kontak tidak valid" }]}
      >
        <Input placeholder="08xxxxxxxxxx" />
      </Form.Item>
      <Form.Item name="propertyAmt" label="Harga (Rp)" rules={[{ required: true, message: "Masukkan harga" }]}>
        <InputNumber
          className="w-full"
          min={0}
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          parser={(v) => v.replace(/\./g, "")}
        />
      </Form.Item>
    </div>
    <Form.Item name="additionalInfo" label="Informasi Tambahan">
      <Input.TextArea rows={4} placeholder="Jumlah kamar, fasilitas, dll." />
    </Form.Item>
  </>
);

export const toFormData = (values, fileField, files = []) => {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  files.forEach((file) => formData.append(fileField, file.originFileObj || file));
  return formData;
};

export default PropertyForm;
