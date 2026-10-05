import logbook from "@/assets/images/logbook.png";
import { LoginIcon } from "@/assets/images/LoginIcon";

export const LeftColumn = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-[#087F5B] to-[#04563D] flex-col items-center justify-center p-12">
      <div className="flex flex-col items-center justify-center h-full">
        {/* Logo */}
        <div className="mb-6">
          <img src={logbook} alt="Logo" className="w-80 h-auto" />
        </div>

        {/* Login Icon */}
        <div className="mt-4">
          <LoginIcon className="w-96 h-auto" />
        </div>
      </div>
    </div>
  );
};
