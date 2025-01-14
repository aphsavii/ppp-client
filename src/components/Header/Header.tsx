import { MobileSidebar } from "./mobile-sidebar";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "@/theme/theme-toggle";
import { useNavigate } from "react-router-dom";
import { removeLocalAuth } from "@/helpers/local-auth";
import { UseDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/auth";
import { LogOut } from "lucide-react";
function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    removeLocalAuth();
    dispatch(logout());
    navigate("/login");
  };

  const auth: AuthState = useSelector((state: rootState) => state.auth);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur dark:bg-black dark:text-white supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">PPP-SLIET</span>
          </a>
          <nav className="flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2">
          <div className="flex md:hidden">
            <a className="flex items-center space-x-2" href="/">
              <span className="font-bold">PPP-SLIET</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {auth.isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
              >
                <LogOut size={14} className="mr-2 inline" />
                Logout
              </button>
            )}
            <MobileSidebar />
          </div>
        </div>
      </div>
    </header>
  );
}
import { useDispatch } from "react-redux";
import { rootState } from "@/redux/store";
import { AuthState } from "@/types/User";

export default Header;
