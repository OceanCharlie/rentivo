import { Logo } from "./Navbar";
import p2 from "../../images/p2.jpg";

// Split layout shared by Login, Register and ForgotPassword
const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen grid md:grid-cols-2">
    <div className="hidden md:block relative">
      <img src={p2} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-brand-700/20" />
      <div className="absolute bottom-12 left-12 right-12 text-white">
        <h2 className="text-3xl font-bold mb-2">Temukan hunian impian Anda</h2>
        <p className="text-brand-50">Ribuan properti terverifikasi dari pemilik yang disetujui admin.</p>
      </div>
    </div>
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Logo className="h-11" />
        </div>
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-slate-500 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
