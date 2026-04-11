import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { icons } from "@/assets/images/Icon";
import { Logo } from "@/assets/images/Logo";
import { LoginIcon } from "@/assets/images/LoginIcon";

const loginSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // TODO: Implement login logic
    console.log("Login attempt:", data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Image Section (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-[#0062A3] to-[#003A6B] flex-col items-center justify-center p-12">
        <div className="flex flex-col items-center justify-center h-full">
          {/* Logo */}
          <div className="mb-6">
            <Logo className="w-48 h-auto" />
          </div>
          {/* Login Icon */}
          <div className="mt-4">
            <LoginIcon className="w-64 h-auto" />
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo (visible only on mobile) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <Logo className="w-40 h-auto mb-4" />
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Masuk
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Silakan masukkan kredensial Anda untuk mengakses akun
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <icons.User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  {...register("username")}
                  placeholder="Masukkan username"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0062A3] focus:border-transparent transition-all text-sm sm:text-base ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <icons.Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  placeholder="Masukkan password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0062A3] focus:border-transparent transition-all text-sm sm:text-base ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 text-[#0062A3] border-gray-300 rounded focus:ring-[#0062A3]"
                />
                <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
              </label>
              <a
                href="#"
                className="text-sm text-[#0062A3] hover:text-[#003A6B] font-medium"
              >
                Lupa password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#0062A3] hover:bg-[#003A6B] text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? "Memuat..." : "Masuk"}
            </button>
          </form>

          {/* Footer Text */}
          <p className="text-center text-xs sm:text-sm text-gray-400 mt-8">
            &copy; {new Date().getFullYear()} Logbook PPDS. Hak cipta
            dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
