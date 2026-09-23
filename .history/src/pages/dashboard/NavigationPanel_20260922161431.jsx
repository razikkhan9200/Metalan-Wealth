import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Wallet,
  ArrowLeftRight,
  ReceiptText,
  Bell,
  Settings,
  CircleHelp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PieChart,
  Menu,
  X,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useTheme } from "./shared/ThemeContext";
import { ProfilePanelContent } from "./UserProfilePanel";
import NotificationPanel from "./NotificationPanel";
import { get } from "../../services/Api";


const MAIN_NAV = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Investments",
    icon: Briefcase,
    path: "/user-admin/investments",
  },
  {
    label: "Properties",
    icon: Building2,
    path: "/user-admin/properties",
  },
  {
    label: "Users",
    icon: Users,
    path: "/user-admin/users",
  },
  {
    label: "Portfolio",
    icon: PieChart,
  },
  {
    label: "Wallet",
    icon: Wallet,
    path: "/user-admin/wallet",
  },
  {
    label: "Transactions",
    icon: ReceiptText,
    path: "/user-admin/transactions",
  },
  {
    label: "Exchange",
    icon: ArrowLeftRight,
    path: "/user-admin/exchange",
  },
];


const ACCOUNT_NAV = [
  {
    label: "Notifications",
    icon: Bell,
    badge: 2,
  },
  {
    label: "Settings",
    icon: Settings,
  },
  {
    label: "Help & Support",
    icon: CircleHelp,
  },
];


export default function NavigationPanel({
  active = "Dashboard",
  onNavigate = () => {},
  onLogout = () => {},
  onExpandChange = () => {},
  userName = "",
  profileImage = "",
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [avatarFailed, setAvatarFailed] = useState(false);

  // API USER
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const { isDark, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();


  /* ============================================================
     LOAD LOGGED-IN USER FROM API
  ============================================================ */

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        setUserLoading(true);

        const response = await get("/dashboard");

        if (!mounted) return;

        /*
          API response expected:

          {
            data: {
              welcome: {
                fullName,
                username,
                userId,
                email,
                profileImage
              }
            }
          }

          Depending on ApiResponse structure, this safely
          supports both response.data and response.data.data.
        */

        const payload =
          response?.data?.data ||
          response?.data ||
          response ||
          {};

        const welcome =
          payload?.welcome ||
          payload?.user ||
          {};

        setUser({
          userId:
            welcome?.userId ||
            welcome?.id ||
            "",

          fullName:
            welcome?.fullName ||
            welcome?.name ||
            "",

          username:
            welcome?.username ||
            "",

          email:
            welcome?.email ||
            "",

          phone:
            welcome?.phone ||
            "",

          profileImage:
            welcome?.profileImage ||
            welcome?.avatar ||
            welcome?.image ||
            "",
        });
      } catch (error) {
        console.error(
          "NavigationPanel: failed to load user details:",
          error
        );

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setUserLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);


  /* ============================================================
     USER DISPLAY DATA
  ============================================================ */

  const actualUserName =
    user?.fullName ||
    userName ||
    "Investor";

  const displayName =
    String(actualUserName).trim() || "Investor";


  const displayInitials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("") || "U";


  /*
    Only show an image if API actually provides one.
    No hardcoded face/image.
  */

  const actualProfileImage =
    user?.profileImage ||
    profileImage ||
    "";


  useEffect(() => {
    setAvatarFailed(false);
  }, [actualProfileImage]);


  /* ============================================================
     THEME
  ============================================================ */

  const sidebarBg = isDark
    ? "bg-[#05080D]/95"
    : "bg-[#F6F8F7]/95";

  const panelBg = isDark
    ? "bg-[#0A1019]"
    : "bg-white";

  const border = isDark
    ? "border-white/[0.07]"
    : "border-black/[0.08]";

  const primary = isDark
    ? "text-white"
    : "text-[#17221D]";

  const secondary = isDark
    ? "text-slate-400"
    : "text-slate-600";

  const muted = "text-slate-500";

  const softBg = isDark
    ? "bg-white/[0.025]"
    : "bg-black/[0.018]";

  const logoBg = isDark
    ? "bg-[#0A1019]"
    : "bg-white";

  const avatarBg = isDark
    ? "bg-[#0A1019]"
    : "bg-white";


  /* ============================================================
     SIDEBAR
  ============================================================ */

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;

      onExpandChange(!next);

      return next;
    });
  };


  const closeMobile = () => {
    setMobileOpen(false);
  };


  /* ============================================================
     NAVIGATION
  ============================================================ */

  const goDashboard = () => {
    closeMobile();

    if (location.pathname === "/dashboard") {
      onNavigate("Dashboard");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    navigate("/dashboard");

    onNavigate("Dashboard");
  };


  const goPortfolio = () => {
    closeMobile();

    onNavigate("Portfolio");

    if (location.pathname !== "/dashboard") {
      navigate("/dashboard");

      window.setTimeout(() => {
        document
          .getElementById("portfolio")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 250);

      return;
    }

    document
      .getElementById("portfolio")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };


  const handleNavigation = (label) => {
    if (label === "Dashboard") {
      goDashboard();
      return;
    }

    if (label === "Portfolio") {
      goPortfolio();
      return;
    }

    /*
      Avatar does nothing.
      Settings is the ONLY account item
      that opens the side User Profile panel.
    */

    if (label === "Settings") {
      closeMobile();

      setProfileOpen(true);

      return;
    }


    if (label === "Notifications") {
      closeMobile();

      setNotificationOpen(true);

      return;
    }


    const item = MAIN_NAV.find(
      (entry) => entry.label === label
    );


    if (item?.path) {
      closeMobile();

      navigate(item.path);

      onNavigate(label);
    }

    // Help & Support intentionally does nothing.
  };


  /* ============================================================
     ACTIVE STATE
  ============================================================ */

  const isActive = (label) => {
    if (label === "Dashboard") {
      return (
        location.pathname === "/dashboard" &&
        active !== "Portfolio"
      );
    }


    if (label === "Portfolio") {
      return active === "Portfolio";
    }


    const item = MAIN_NAV.find(
      (entry) => entry.label === label
    );


    return Boolean(
      item?.path &&
      location.pathname.startsWith(item.path)
    );
  };


  /* ============================================================
     NAV BUTTON
  ============================================================ */

  const navButton = (selected) => `
    group relative flex w-full items-center gap-3
    rounded-xl border px-3 py-3 text-left
    transition-all duration-200

    ${
      selected
        ? isDark
          ? "border-[#D4AF6A]/20 bg-[#D4AF6A]/[0.08] text-white shadow-[inset_3px_0_0_#D4AF6A]"
          : "border-[#A8792D]/20 bg-[#A8792D]/[0.07] text-[#17221D] shadow-[inset_3px_0_0_#A8792D]"
        : isDark
          ? "border-transparent text-slate-400 hover:bg-white/[0.035] hover:text-slate-100"
          : "border-transparent text-slate-600 hover:bg-black/[0.025] hover:text-[#17221D]"
    }
  `;


  /* ============================================================
     MAIN NAV RENDER
  ============================================================ */

  const renderMainNav = (mobile = false) =>
    MAIN_NAV.map(({ label, icon: Icon }) => {
      const selected = isActive(label);

      return (
        <button
          key={label}
          type="button"
          title={
            !mobile && collapsed
              ? label
              : undefined
          }
          onClick={() =>
            handleNavigation(label)
          }
          className={navButton(selected)}
        >
          <Icon
            size={18}
            className={
              selected
                ? "text-[#D4AF6A]"
                : isDark
                  ? "text-slate-500 group-hover:text-[#D4AF6A]"
                  : "text-slate-500 group-hover:text-[#A8792D]"
            }
          />

          {(!collapsed || mobile) && (
            <span className="text-[13px] font-medium">
              {label}
            </span>
          )}

          {!mobile &&
            !collapsed &&
            selected && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D4AF6A]" />
            )}
        </button>
      );
    });


  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <header
        style={{
          backgroundColor: isDark
            ? "rgba(5,8,13,0.97)"
            : "rgba(246,248,247,0.98)",

          colorScheme: isDark
            ? "dark"
            : "light",
        }}
        className={`
          fixed inset-x-0 top-0 z-50
          flex h-16 items-center justify-between
          border-b ${border}
          ${sidebarBg}
          px-4
          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          backdrop-blur-xl
          md:hidden
        `}
      >
        <button
          type="button"
          onClick={goDashboard}
          className="flex min-w-0 items-center gap-2.5"
        >
          <span
            className={`
              grid h-9 w-9 shrink-0 place-items-center
              rounded-xl border border-[#D4AF6A]/50
              ${panelBg}
              font-serif text-lg text-[#E2C17F]
            `}
          >
            M
          </span>

          <span
            className={`
              truncate text-sm font-semibold
              tracking-wide ${primary}
            `}
          >
            {active === "Dashboard"
              ? "METALAN"
              : active}
          </span>
        </button>


        <button
          type="button"
          onClick={() =>
            setMobileOpen((prev) => !prev)
          }
          aria-label={
            mobileOpen
              ? "Close menu"
              : "Open menu"
          }
          className={`
            grid h-10 w-10 shrink-0
            place-items-center rounded-xl
            border ${border}
            ${softBg}
            ${secondary}
            transition-all duration-200
            hover:border-[#D4AF6A]/30
            hover:text-[#D4AF6A]
          `}
        >
          {mobileOpen ? (
            <X size={18} />
          ) : (
            <Menu size={18} />
          )}
        </button>


        {mobileOpen && (
          <div
            className={`
              absolute inset-x-3 top-[68px]
              max-h-[calc(100dvh-84px)]
              overflow-y-auto
              rounded-2xl border ${border}
              ${panelBg}
              p-2 shadow-2xl
              backdrop-blur-xl
            `}
          >
            <div className="space-y-1">
              {renderMainNav(true)}
            </div>


            <div
              className={`my-2 border-t ${border}`}
            />


            <div className="grid grid-cols-3 gap-1.5">
              {ACCOUNT_NAV.map(
                ({
                  label,
                  icon: Icon,
                  badge,
                }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() =>
                      handleNavigation(label)
                    }
                    className={`
                      relative flex min-w-0
                      flex-col items-center
                      gap-1.5 rounded-xl
                      px-2 py-2.5
                      ${secondary}
                      transition
                      ${
                        label === "Settings"
                          ? "hover:text-[#D4AF6A]"
                          : "cursor-default opacity-70"
                      }
                    `}
                  >
                    <span className="relative">
                      <Icon size={17} />

                      {badge > 0 && (
                        <span
                          className="
                            absolute -right-2 -top-2
                            grid h-4 min-w-4
                            place-items-center
                            rounded-full
                            bg-[#D4AF6A]
                            px-1 text-[9px]
                            font-bold text-[#1A1305]
                          "
                        >
                          {badge}
                        </span>
                      )}
                    </span>

                    <span className="truncate text-[10px]">
                      {label}
                    </span>
                  </button>
                )
              )}
            </div>


            <button
              type="button"
              onClick={toggleTheme}
              className={`
                mt-2 flex w-full
                items-center justify-center gap-2
                rounded-xl border ${border}
                ${softBg}
                py-2.5 text-xs
                font-medium ${secondary}
                transition hover:text-[#D4AF6A]
              `}
            >
              {isDark ? (
                <Sun size={16} />
              ) : (
                <Moon size={16} />
              )}

              {isDark
                ? "Switch to light mode"
                : "Switch to dark mode"}
            </button>


            <button
              type="button"
              onClick={() => {
                onLogout();
                closeMobile();
              }}
              className={`
                mt-1.5 flex w-full
                items-center justify-center gap-2
                rounded-xl border ${border}
                ${softBg}
                py-2.5 text-xs
                font-medium ${muted}
                transition hover:text-rose-500
              `}
            >
              <LogOut size={16} />

              Sign out
            </button>
          </div>
        )}
      </header>


      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside
        style={{
          backgroundColor: isDark
            ? "rgba(5,8,13,0.97)"
            : "rgba(246,248,247,0.985)",

          colorScheme: isDark
            ? "dark"
            : "light",
        }}
        className={`
          fixed left-0 top-0 z-50
          hidden h-screen flex-col
          border-r ${border}
          ${sidebarBg}
          shadow-[12px_0_45px_rgba(0,0,0,0.12)]
          backdrop-blur-xl
          transition-all duration-300
          md:flex
          ${
            collapsed
              ? "w-[78px]"
              : "w-[250px]"
          }
        `}
      >

        {/* =====================================================
            LOGO
        ====================================================== */}

        <div
          className={`
            flex h-[82px] shrink-0 items-center
            border-b ${border} px-4
            ${
              collapsed
                ? "justify-center"
                : ""
            }
          `}
        >
          <button
            type="button"
            onClick={goDashboard}
            className="flex items-center gap-3"
          >
            <span
              className={`
                grid h-11 w-11 shrink-0
                place-items-center rounded-xl
                border border-[#D4AF6A]/50
                ${panelBg}
                font-serif text-xl text-[#E2C17F]
                shadow-[0_0_25px_rgba(212,175,106,0.08)]
              `}
            >
              M
            </span>


            {!collapsed && (
              <span>
                <p
                  className={`
                    font-serif text-[16px]
                    font-semibold tracking-wide
                    ${primary}
                  `}
                >
                  METALAN
                </p>

                <p className="mt-0.5 text-[9px] tracking-[0.28em] text-[#D4AF6A]">
                  WEALTH
                </p>
              </span>
            )}
          </button>
        </div>


        {/* =====================================================
            AVATAR / PROFILE

            API USER DATA
            No hardcoded face
        ====================================================== */}

        <div className="px-3 pt-5">
          <div
            title="Profile"
            style={{
              backgroundColor: isDark
                ? "#0A1019"
                : "#FFFFFF",
            }}
            className={`
              w-full rounded-2xl
              border ${border}
              ${panelBg}
              p-3
              ${
                collapsed
                  ? "flex justify-center"
                  : "flex items-center gap-3"
              }
            `}
          >
            <div
              className={`
                relative grid h-10 w-10
                shrink-0 place-items-center
                overflow-hidden rounded-full
                border border-[#D4AF6A]/40
                ${
                  avatarFailed ||
                  !actualProfileImage
                    ? isDark
                      ? "bg-[#0A1019]"
                      : "bg-white"
                    : ""
                }
              `}
            >

              {/* API IMAGE ONLY */}
              {actualProfileImage &&
              !avatarFailed ? (
                <img
                  src={actualProfileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={() =>
                    setAvatarFailed(true)
                  }
                />
              ) : (
                /* INITIALS FROM API USER */
                <span
                  aria-hidden="true"
                  className="
                    font-semibold
                    text-[13px]
                    tracking-wide
                    text-[#D4AF6A]
                  "
                >
                  {displayInitials}
                </span>
              )}


              <span
                className={`
                  absolute bottom-0 right-0
                  h-2.5 w-2.5 rounded-full
                  border-2
                  ${
                    isDark
                      ? "border-[#0A1019]"
                      : "border-white"
                  }
                  bg-emerald-400
                `}
              />
            </div>


            {!collapsed && (
              <div className="min-w-0">
                <p
                  className={`
                    truncate text-sm
                    font-semibold ${primary}
                  `}
                >
                  {userLoading
                    ? "Loading..."
                    : displayName}
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                  <ShieldCheck
                    size={12}
                    className="text-emerald-500"
                  />

                  <span
                    className={`
                      text-[10px] ${muted}
                    `}
                  >
                    Verified Investor
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* =====================================================
            MAIN NAV
        ====================================================== */}

        <nav
          data-lenis-prevent
          className="
            mt-6 min-h-0 flex-1
            overflow-y-auto overscroll-contain
            px-3
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {!collapsed && (
            <p
              className={`
                mb-2 px-3 text-[9px]
                font-semibold uppercase
                tracking-[0.24em]
                ${muted}
              `}
            >
              Overview
            </p>
          )}


          <div className="space-y-1">
            {renderMainNav()}
          </div>


          {!collapsed && (
            <p
              className={`
                mb-2 mt-7 px-3 text-[9px]
                font-semibold uppercase
                tracking-[0.24em]
                ${muted}
              `}
            >
              Account
            </p>
          )}


          <div className="space-y-1">
            {ACCOUNT_NAV.map(
              ({
                label,
                icon: Icon,
                badge,
              }) => {
                const settingsSelected =
                  label === "Settings" &&
                  profileOpen;


                return (
                  <button
                    key={label}
                    type="button"
                    title={
                      collapsed
                        ? label
                        : undefined
                    }
                    onClick={() =>
                      handleNavigation(label)
                    }
                    className={navButton(
                      settingsSelected
                    )}
                  >
                    <span className="relative shrink-0">
                      <Icon
                        size={18}
                        className={
                          settingsSelected
                            ? "text-[#D4AF6A]"
                            : isDark
                              ? "text-slate-500"
                              : "text-slate-500"
                        }
                      />


                      {badge > 0 && (
                        <span
                          className="
                            absolute -right-2 -top-2
                            grid h-4 min-w-4
                            place-items-center
                            rounded-full
                            bg-[#D4AF6A]
                            px-1 text-[9px]
                            font-bold text-[#1A1305]
                          "
                        >
                          {badge}
                        </span>
                      )}
                    </span>


                    {!collapsed && (
                      <span className="flex min-w-0 flex-1 items-center justify-between">
                        <span
                          className="
                            truncate text-[13px]
                            font-medium
                          "
                        >
                          {label}
                        </span>


                        {badge > 0 && (
                          <span
                            className="
                              ml-auto rounded-full
                              bg-[#D4AF6A]/10
                              px-2 py-0.5
                              text-[9px] font-semibold
                              text-[#A8792D]
                            "
                          >
                            New
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </nav>


        {/* =====================================================
            BOTTOM
        ====================================================== */}

        <div
          className={`
            border-t ${border} p-3
          `}
        >
          <button
            type="button"
            onClick={toggleTheme}
            title={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className={`
              flex w-full items-center
              gap-3 rounded-xl
              px-3 py-3
              ${muted}
              transition
              ${
                isDark
                  ? "hover:bg-white/[0.035]"
                  : "hover:bg-black/[0.03]"
              }
              hover:text-[#D4AF6A]
            `}
          >
            {isDark ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}


            {!collapsed && (
              <span className="text-[13px] font-medium">
                {isDark
                  ? "Light mode"
                  : "Dark mode"}
              </span>
            )}
          </button>


          <button
            type="button"
            onClick={onLogout}
            className={`
              flex w-full items-center
              gap-3 rounded-xl
              px-3 py-3
              ${muted}
              transition
              ${
                isDark
                  ? "hover:bg-rose-400/[0.05]"
                  : "hover:bg-rose-500/[0.05]"
              }
              hover:text-rose-500
            `}
          >
            <LogOut size={18} />

            {!collapsed && (
              <span className="text-[13px] font-medium">
                Sign out
              </span>
            )}
          </button>


          <button
            type="button"
            onClick={toggleSidebar}
            title={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className={`
              mt-1 flex w-full
              items-center justify-center
              gap-2 rounded-xl
              border ${border}
              ${softBg}
              py-2.5 ${muted}
              transition
              ${
                isDark
                  ? "hover:border-white/10 hover:text-slate-300"
                  : "hover:border-black/10 hover:text-slate-700"
              }
            `}
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />

                <span className="text-[10px] uppercase tracking-wider">
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>
      </aside>


      {/* =====================================================
          USER PROFILE PANEL
      ====================================================== */}

      {profileOpen && (
        <ProfilePanelContent
          onClose={() =>
            setProfileOpen(false)
          }
        />
      )}


      {/* =====================================================
          NOTIFICATIONS
      ====================================================== */}

      {notificationOpen && (
        <NotificationPanel
          onClose={() =>
            setNotificationOpen(false)
          }
        />
      )}
    </>
  );
}