import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Empty, Form, Input, InputNumber, Modal, Pagination, Select, Skeleton, message } from "antd";
import { EnvironmentOutlined, HomeOutlined } from "@ant-design/icons";
import api, { formatRupiah, imageUrl } from "../../api";
import StatusTag from "../common/StatusTag";

const PAGE_SIZE = 6;

const TYPE_LABEL = { residential: "Hunian", commercial: "Komersial", "land/plot": "Tanah" };
const AD_LABEL = { rent: "Disewa", sale: "Dijual" };

const PropertyImage = ({ property, className }) => {
  const src = imageUrl(property);
  return src ? (
    <img src={src} alt={property.propertyAddress} className={`object-cover ${className}`} />
  ) : (
    <div className={`bg-slate-100 flex items-center justify-center text-4xl text-slate-300 ${className}`}>
      <HomeOutlined />
    </div>
  );
};

const AllPropertiesCards = ({ loggedIn }) => {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ address: "", adType: "", type: "", min: null, max: null, sort: "newest" });
  const [page, setPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [booking, setBooking] = useState(false);
  const [form] = Form.useForm();

  const getAllProperties = async () => {
    const res = await api.get("/user/getAllProperties");
    setAllProperties(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const filteredProperties = useMemo(() => {
    const list = allProperties.filter(
      (p) =>
        p.propertyAddress.toLowerCase().includes(filters.address.toLowerCase()) &&
        (!filters.adType || p.propertyAdType === filters.adType) &&
        (!filters.type || p.propertyType === filters.type) &&
        (filters.min == null || p.propertyAmt >= filters.min) &&
        (filters.max == null || p.propertyAmt <= filters.max)
    );
    if (filters.sort === "priceAsc") return [...list].sort((a, b) => a.propertyAmt - b.propertyAmt);
    if (filters.sort === "priceDesc") return [...list].sort((a, b) => b.propertyAmt - a.propertyAmt);
    return list;
  }, [allProperties, filters]);

  const pageItems = filteredProperties.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleBooking = async (values) => {
    setBooking(true);
    const res = await api.post(`/user/bookinghandle/${selectedProperty._id}`, { userDetails: values });
    setBooking(false);

    if (res.data.success) {
      message.success(res.data.message);
      setSelectedProperty(null);
      form.resetFields();
    } else {
      message.error(res.data.message);
    }
    getAllProperties();
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
        <Input
          className="md:col-span-2"
          prefix={<EnvironmentOutlined className="text-slate-400" />}
          placeholder="Cari berdasarkan alamat"
          allowClear
          value={filters.address}
          onChange={(e) => updateFilter("address", e.target.value)}
        />
        <Select
          value={filters.adType}
          onChange={(v) => updateFilter("adType", v)}
          options={[{ value: "", label: "Semua Iklan" }, { value: "rent", label: "Disewa" }, { value: "sale", label: "Dijual" }]}
        />
        <Select
          value={filters.type}
          onChange={(v) => updateFilter("type", v)}
          options={[
            { value: "", label: "Semua Tipe" },
            { value: "residential", label: "Hunian" },
            { value: "commercial", label: "Komersial" },
            { value: "land/plot", label: "Tanah" },
          ]}
        />
        <div className="flex gap-2">
          <InputNumber className="w-full" min={0} placeholder="Harga min" value={filters.min} onChange={(v) => updateFilter("min", v)} />
          <InputNumber className="w-full" min={0} placeholder="Harga max" value={filters.max} onChange={(v) => updateFilter("max", v)} />
        </div>
        <Select
          value={filters.sort}
          onChange={(v) => updateFilter("sort", v)}
          options={[
            { value: "newest", label: "Terbaru" },
            { value: "priceAsc", label: "Harga terendah" },
            { value: "priceDesc", label: "Harga tertinggi" },
          ]}
        />
      </div>

      {/* Cards */}
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : pageItems.length === 0 ? (
        <Empty description="Belum ada properti yang sesuai" className="py-12" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map((property) => (
            <div key={property._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col">
              <div className="relative">
                <PropertyImage property={property} className="w-full h-48" />
                <div className="absolute top-3 left-3">
                  <StatusTag status={property.isAvailable} />
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="text-xs uppercase tracking-wide text-brand-700 font-semibold">
                  {TYPE_LABEL[property.propertyType]} · {AD_LABEL[property.propertyAdType]}
                </div>
                <h3 className="font-semibold text-lg mt-1 line-clamp-2">{property.propertyAddress}</h3>
                {loggedIn ? (
                  <div className="text-xl font-bold text-navy-900 mt-2">
                    {formatRupiah(property.propertyAmt)}
                    {property.propertyAdType === "rent" && <span className="text-sm font-normal text-slate-500"> /bulan</span>}
                  </div>
                ) : null}
                <div className="mt-auto pt-4">
                  {loggedIn ? (
                    <Button type="primary" block onClick={() => setSelectedProperty(property)}>
                      Lihat Detail / Booking
                    </Button>
                  ) : (
                    <Link to="/login">
                      <Button block>Login untuk melihat detail</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProperties.length > PAGE_SIZE && (
        <div className="flex justify-center mt-8">
          <Pagination current={page} pageSize={PAGE_SIZE} total={filteredProperties.length} onChange={setPage} showSizeChanger={false} />
        </div>
      )}

      {/* Detail & booking modal */}
      <Modal
        open={!!selectedProperty}
        onCancel={() => setSelectedProperty(null)}
        footer={null}
        width={720}
        title="Detail Properti"
        destroyOnHidden
      >
        {selectedProperty && (
          <>
            <PropertyImage property={selectedProperty} className="w-full h-64 rounded-lg" />
            {selectedProperty.propertyImage.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {selectedProperty.propertyImage.slice(1).map((img) => (
                  <img key={img.filename} src={imageUrl({ propertyImage: [img] })} alt="" className="w-24 h-16 object-cover rounded" />
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div><span className="text-slate-500">Alamat</span><div className="font-medium">{selectedProperty.propertyAddress}</div></div>
              <div><span className="text-slate-500">Harga</span><div className="font-medium">{formatRupiah(selectedProperty.propertyAmt)}</div></div>
              <div><span className="text-slate-500">Tipe</span><div className="font-medium">{TYPE_LABEL[selectedProperty.propertyType]} · {AD_LABEL[selectedProperty.propertyAdType]}</div></div>
              <div><span className="text-slate-500">Status</span><div><StatusTag status={selectedProperty.isAvailable} /></div></div>
              <div><span className="text-slate-500">Pemilik</span><div className="font-medium">{selectedProperty.ownerName}</div></div>
              <div><span className="text-slate-500">Kontak</span><div className="font-medium">{selectedProperty.ownerContact}</div></div>
            </div>
            {selectedProperty.additionalInfo && (
              <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">{selectedProperty.additionalInfo}</p>
            )}

            {selectedProperty.isAvailable === "Available" ? (
              <Form form={form} layout="vertical" onFinish={handleBooking} requiredMark={false} className="mt-4 border-t border-slate-100 pt-4">
                <div className="grid sm:grid-cols-2 gap-x-3">
                  <Form.Item name="fullName" label="Nama Lengkap" rules={[{ required: true, message: "Masukkan nama" }]}>
                    <Input placeholder="Nama sesuai KTP" />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="No. Telepon"
                    rules={[{ required: true, pattern: /^[0-9+\-\s]{8,15}$/, message: "Nomor telepon tidak valid" }]}
                  >
                    <Input placeholder="08xxxxxxxxxx" />
                  </Form.Item>
                </div>
                <Button type="primary" htmlType="submit" block loading={booking}>
                  Ajukan Booking
                </Button>
              </Form>
            ) : (
              <p className="mt-4 text-center text-red-500">Properti ini sudah dibooking.</p>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export { TYPE_LABEL, AD_LABEL, PropertyImage };
export default AllPropertiesCards;
