import { Tabs } from "antd";
import Navbar from "./Navbar";

const DashboardLayout = ({ title, subtitle, tabs, activeKey, onChange }) => (
  <div className="min-h-screen">
    <Navbar />
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      <p className="text-slate-500 mb-6">{subtitle}</p>
      <Tabs items={tabs} activeKey={activeKey} onChange={onChange} destroyOnHidden />
    </div>
  </div>
);

export default DashboardLayout;
