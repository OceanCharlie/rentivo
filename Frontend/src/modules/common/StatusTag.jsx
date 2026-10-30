import { Tag } from "antd";

const STATUS = {
  pending: { color: "gold", label: "Menunggu" },
  booked: { color: "green", label: "Dikonfirmasi" },
  rejected: { color: "red", label: "Ditolak" },
  cancelled: { color: "default", label: "Dibatalkan" },
  Available: { color: "green", label: "Tersedia" },
  Booked: { color: "volcano", label: "Sudah Dibooking" },
  granted: { color: "green", label: "Disetujui" },
  ungranted: { color: "orange", label: "Menunggu Persetujuan" },
};

const StatusTag = ({ status }) => {
  const s = STATUS[status] || { color: "default", label: status };
  return <Tag color={s.color}>{s.label}</Tag>;
};

export default StatusTag;
