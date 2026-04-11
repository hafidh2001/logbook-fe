import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import { ROUTES } from "@/utils/routes";
import { Logo } from "@/assets/images/Logo";
import { navItems } from "@/data/sidebar";

export const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<string[]>(["Rekap"]);
  const navigate = useNavigate();

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleLogout = () => {
    // TODO: Clear session/cookies
    navigate(ROUTES.logout);
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col px-4 py-6 gap-1">
      {/* Logo */}
      <div className="flex items-center justify-center px-2 mb-7">
        <Logo className="w-40 h-auto" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isOpen = openMenus.includes(item.label);

          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <icons.ChevronDown
                    size={16}
                    className={`ml-auto transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="flex flex-col gap-0.5 pl-9 mt-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isActive
                              ? "bg-blue-600 text-white"
                              : "text-gray-800 hover:bg-gray-100"
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Special handling for Logout
          if (item.label === "Logout") {
            return (
              <button
                key={item.to}
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
              >
                {item.icon}
                {item.label}
              </button>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to!}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-800 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
