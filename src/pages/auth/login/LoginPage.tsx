import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import { Logo } from "@/assets/images/Logo";
import { LoginIcon } from "@/assets/images/LoginIcon";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/utils/routes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

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
    const success = await login(data);

    if (success) {
      navigate(ROUTES.dashboard);
    }
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Field */}
            <FormField error={errors.username?.message}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <icons.User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    id="username"
                    placeholder="Masukkan username"
                    className="pl-10 pr-4 py-3"
                    {...register("username")}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormField>

            {/* Password Field */}
            <FormField error={errors.password?.message}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <icons.Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Masukkan password"
                    className="pl-10 pr-10 py-3"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
                  >
                    {showPassword ? (
                      <icons.EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <icons.Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormField>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <FormField className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  {...register("rememberMe")}
                />
                <FormLabel
                  htmlFor="rememberMe"
                  className="text-sm text-gray-600 font-normal cursor-pointer"
                >
                  Ingat saya
                </FormLabel>
              </FormField>
              <a
                href="#"
                className="text-sm text-[#0062A3] hover:text-[#003A6B] font-medium"
              >
                Lupa password?
              </a>
            </div>

            {/* Login Button */}
            <Button type="submit" disabled={isLoading} className="w-full py-3">
              {isLoading ? "Memuat..." : "Masuk"}
            </Button>
          </form>

          {/* Footer Text */}
          <p className="text-center text-xs sm:text-sm text-gray-400 mt-8">
            &copy; {new Date().getFullYear()} Logbook PPDS. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
