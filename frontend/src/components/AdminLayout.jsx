import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  ShoppingBag,
  Users,
  Menu,
  Search,
  ChevronDown,
  LogOut,
  UserCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ThemeToggle from "@/components/ThemeToggle";
import PageTransition from "@/components/PageTransition";
import { clearUser } from "@/redux/userSlice";
import { toast } from "sonner";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard/sales",
    icon: "dashboard",
  },
  {
    label: "Product Management",
    to: "/dashboard/products",
    icon: "package",
  },
  {
    label: "Add Product",
    to: "/dashboard/add-product",
    icon: "package-plus",
  },
  {
    label: "Order Tracking",
    to: "/dashboard/orders",
    icon: "shopping-bag",
  },
  {
    label: "User Management",
    to: "/dashboard/users",
    icon: "users",
  },
];

const getPageTitle = (pathname) => {
  if (pathname.includes("/dashboard/users/orders")) return "User Orders";
  if (pathname.includes("/dashboard/users/") && pathname !== "/dashboard/users") return "User Details";
  if (pathname === "/dashboard" || pathname === "/dashboard/") return "Admin Overview";
  if (pathname.includes("/dashboard/sales")) return "Dashboard";
  if (pathname.includes("/dashboard/add-product")) return "Add Product";
  if (pathname.includes("/dashboard/products")) return "Product Management";
  if (pathname.includes("/dashboard/orders")) return "Order Tracking";
  if (pathname.includes("/dashboard/users")) return "User Management";
  return "Admin Panel";
};

/**
 * Admin dashboard layout wrapper with responsive sidebar, header, and child route rendering.
 */
const AdminLayout = () => {
  const { user } = useSelector((store) => store.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pageTitle = getPageTitle(location.pathname);

  const logoutHandler = () => {
    dispatch(clearUser());
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/50 text-foreground">
      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="fixed inset-y-0 left-0 z-50 grid w-80 gap-4 overflow-y-auto rounded-r-3xl border-r border-border bg-card p-6 text-sm shadow-2xl shadow-black/10 data-open:animate-in data-open:fade-in-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin menu</p>
              <h2 className="text-lg font-semibold">EKART Dashboard</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon =
                item.icon === "dashboard"
                  ? LayoutDashboard
                  : item.icon === "package"
                    ? Package
                    : item.icon === "package-plus"
                      ? PackagePlus
                      : item.icon === "shopping-bag"
                        ? ShoppingBag
                        : Users;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${isActive
                      ? "border-l-4 border-primary bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Store</span>
            </NavLink>
          </nav>
        </DialogContent>
      </Dialog>

      <div className="md:flex">
        <aside className="hidden h-screen w-72 shrink-0 border-r border-border bg-card p-6 shadow-sm shadow-black/5 md:block">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
            <h1 className="mt-3 text-2xl font-semibold">EKART Control</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage users, orders, products, and sales.</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon =
                item.icon === "dashboard"
                  ? LayoutDashboard
                  : item.icon === "package"
                    ? Package
                    : item.icon === "package-plus"
                      ? PackagePlus
                      : item.icon === "shopping-bag"
                        ? ShoppingBag
                        : Users;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${isActive
                      ? "border-l-4 border-primary bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition text-muted-foreground hover:bg-muted hover:text-foreground mt-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Store</span>
            </NavLink>
          </nav>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md px-4 py-4 shadow-sm shadow-black/5 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin panel</p>
                  <h2 className="text-xl font-semibold text-foreground">{pageTitle}</h2>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                <div className="relative hidden md:block md:w-[320px]">
                  <Input
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search admin tasks..."
                    className="h-11 rounded-2xl pl-11"
                  />
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setProfileOpen((current) => !current)}
                      aria-label="Open profile menu"
                    >
                      <UserCircle className="h-5 w-5" />
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    {profileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-lg shadow-black/10">
                        <div className="mb-3 flex items-center gap-3 rounded-3xl bg-muted/70 p-3">
                          <UserCircle className="h-6 w-6 text-primary" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{user?.firstName ?? "Admin"}</p>
                            <p className="text-xs text-muted-foreground">Administrator</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setProfileOpen(false);
                            navigate("/dashboard/users");
                          }}
                        >
                          View users
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setProfileOpen(false);
                            logoutHandler();
                          }}
                        >
                          Sign out
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="min-h-[calc(100vh-88px)] bg-background px-4 py-6 md:px-6">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

