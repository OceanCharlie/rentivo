import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { SafetyCertificateOutlined, SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import p1 from "../../images/p1.jpg";
import p2 from "../../images/p2.jpg";
import p3 from "../../images/p3.jpg";
import p4 from "../../images/p4.jpg";
import Navbar from "./Navbar";
import AllPropertiesCards from "../user/AllPropertiesCards";
import { UserContext, homePath } from "../../App";

const images = [p1, p2, p3, p4];

const features = [
  { icon: <SafetyCertificateOutlined />, title: "Pemilik Terverifikasi", text: "Hanya pemilik yang disetujui admin yang bisa memasang iklan." },
  { icon: <SearchOutlined />, title: "Pencarian Mudah", text: "Filter berdasarkan lokasi, tipe, dan rentang harga." },
  { icon: <CalendarOutlined />, title: "Booking Cepat", text: "Ajukan booking dan pantau statusnya secara langsung." },
];

const Home = () => {
  const { userData } = useContext(UserContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentIndex === idx ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold max-w-2xl leading-tight">
            Sewa properti jadi lebih <span className="text-teal-300">mudah</span> & aman
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mt-4 max-w-xl">
            Rentivo menghubungkan penyewa dengan pemilik properti terverifikasi di seluruh Indonesia.
          </p>
          <div className="flex gap-3 mt-8">
            <a href="#properties">
              <Button type="primary" size="large">Lihat Properti</Button>
            </a>
            <Link to={userData ? homePath(userData) : "/register"}>
              <Button size="large" ghost>{userData ? "Ke Dashboard" : "Pasang Properti"}</Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${currentIndex === idx ? "w-8 bg-teal-300" : "w-2 bg-white/60"}`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10 grid md:grid-cols-3 gap-4 w-full">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded-xl shadow-lg p-6 flex gap-4">
            <div className="text-2xl text-teal-600">{f.icon}</div>
            <div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-slate-500 text-sm">{f.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Properties */}
      <section id="properties" className="max-w-7xl mx-auto px-6 py-16 w-full">
        <h2 className="text-3xl font-bold mb-2">Jelajahi Properti</h2>
        <p className="text-slate-500 mb-8">
          {userData ? "Pilih properti dan ajukan booking." : "Login sebagai penyewa untuk melihat detail dan melakukan booking."}
        </p>
        <AllPropertiesCards loggedIn={userData?.type === "Renter"} />
      </section>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Rentivo. Semua hak dilindungi.
      </footer>
    </div>
  );
};

export default Home;
