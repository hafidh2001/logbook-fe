import orthoLogo from "@/assets/images/logo_uns_ortho.png";
import medicine from "@/assets/images/medicine.svg";

export const LeftColumn = () => {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-b from-[#087F5B] to-[#04563D] flex-col items-center justify-center px-12 pb-12 pt-40">
        {/* Logo */}
        <div className="absolute left-8 top-8 flex items-center gap-4">
          <img src={orthoLogo} alt="Logo UNS Orthopaedi" className="h-20 w-20 object-contain" />
          <div className="flex flex-col gap-2">
            <span className="text-4xl font-bold leading-none tracking-tight text-white">Logbook</span>
            <span className="text-sm font-semibold uppercase leading-none tracking-[0.22em] text-emerald-100">Medlink</span>
          </div>
        </div>

        {/* Login Icon */}
        <div className="mt-4">
          <img src={medicine} alt="Ilustrasi tenaga medis" className="w-96 max-w-full h-auto" />
        </div>
    </div>
  );
};
