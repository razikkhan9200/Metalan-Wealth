import { useEffect, useRef, useState } from "react";
import {
  User,
  X,
  Pencil,
  Award,
  ShieldCheck,
  Mail,
  Phone,
  CalendarDays,
  Globe2,
  Camera,
  Sparkles,
  BadgeCheck,
  Save,
} from "lucide-react";

import { useTheme } from "./shared/ThemeContext";
import { get, put } from "../../services/Api";
import { toast } from "../../utils/toast";

const THEME_KEY = "metalan_theme";
const AVATAR_KEY = "metalan_profile_avatar";

const FALLBACK_PROFILE = {
  fullName: "Alexander Mitchell",
  username: "alex_mitchell",
  email: "alex.mitchell@email.com",
  phone: "+1 (555) 234-5678",
  dateOfBirth: "March 15, 1992",
  country: "United States",
  avatarUrl: null,
  isPremium: true,
  memberSince: "March 2024",
  kyc: "Verified",
};

const FIELDS = [
  ["fullName", "Full Name", "text", User],
  ["email", "Email Address", "email", Mail],
  ["phone", "Phone Number", "tel", Phone],
  ["dateOfBirth", "Date of Birth", "text", CalendarDays],
  ["country", "Country", "text", Globe2],
];

const makeForm = (profile = {}) =>
  FIELDS.reduce((acc, [key]) => {
    acc[key] = profile?.[key] ?? "";
    return acc;
  }, {});

/* =========================================================
   PROFILE PANEL
========================================================= */

export function ProfilePanelContent({
  onClose = () => {},
}) {
  const { theme, isDark } = useTheme();
  const panelRef = useRef(null);

  const [profile, setProfile] = useState(FALLBACK_PROFILE);
  const [form, setForm] = useState(makeForm(FALLBACK_PROFILE));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const storedTheme =
    typeof window !== "undefined"
      ? window.localStorage.getItem(THEME_KEY)
      : null;

  const currentTheme =
    theme === "light" || theme === "dark"
      ? theme
      : storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : isDark
          ? "dark"
          : "light";

  const dark = currentTheme === "dark";

  const COLORS = {
    panel: dark ? "#0A1019" : "#FFFFFF",
    card: dark ? "rgba(255,255,255,.025)" : "#F7F9F8",
    field: dark ? "rgba(0,0,0,.18)" : "#FFFFFF",
    border: dark ? "rgba(255,255,255,.085)" : "rgba(20,35,29,.10)",
    text: dark ? "#F4F7F5" : "#17221D",
    sub: dark ? "#C8D0CC" : "#34443D",
    muted: dark ? "#738079" : "#718078",
    accent: dark ? "#D4AF6A" : "#A8792D",
  };

  /* Open animation */
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* Load profile + locally saved photo */
  useEffect(() => {
    let cancelled = false;

    try {
      const savedAvatar = localStorage.getItem(AVATAR_KEY);
      if (savedAvatar) setAvatar(savedAvatar);
    } catch {}

    // GET /api/auth/me (protected) — response is the usual
    // { success, message, data: { user } } envelope, so the profile
    // fields are under data.user, not the top level.
    get("/auth/me")
      .then((res) => {
        if (cancelled) return;

        const user = res?.data?.user;
        const next = user ? { ...FALLBACK_PROFILE, ...user } : FALLBACK_PROFILE;

        setProfile(next);
        setForm(makeForm(next));
      })
      .catch(() => {
        if (cancelled) return;
        setProfile(FALLBACK_PROFILE);
        setForm(makeForm(FALLBACK_PROFILE));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* Lock background while panel is open */
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    const oldBodyOverflow = body.style.overflow;
    const oldBodyPadding = body.style.paddingRight;
    const oldHtmlOverflow = html.style.overflow;

    const scrollbar =
      window.innerWidth - html.clientWidth;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    if (scrollbar > 0) {
      body.style.paddingRight = `${scrollbar}px`;
    }

    return () => {
      body.style.overflow = oldBodyOverflow;
      body.style.paddingRight = oldBodyPadding;
      html.style.overflow = oldHtmlOverflow;
    };
  }, []);

  /* Escape */
  useEffect(() => {
    panelRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closePanel();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
  });

  const closePanel = () => {
    if (closing) return;

    setClosing(true);
    setVisible(false);

    window.setTimeout(onClose, 260);
  };

  const handleChange = (key) => (event) => {
    setForm((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result =
        typeof reader.result === "string"
          ? reader.result
          : "";

      if (!result) {
        setError("Couldn't load that image.");
        return;
      }

      setAvatar(result);
      setError("");

      try {
        localStorage.setItem(AVATAR_KEY, result);
      } catch {}
    };

    reader.onerror = () =>
      setError("Couldn't load that image.");

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");

    try {
      // TODO(backend): there is currently no "update profile" endpoint
      // on the backend (only PUT /api/auth/change-password exists, for
      // the password specifically) — this call 404s until that route
      // is added.
      const updated = await toast.promise(
        put("/users/me", form),
        {
          loading: "Saving your changes...",
          success: "Profile updated.",
          error: (err) =>
            err?.message ||
            "Couldn't save your changes. Please try again.",
        }
      );

      setProfile((prev) => ({
        ...prev,
        ...(updated || {}),
      }));

      closePanel();
    } catch (err) {
      setError(
        err?.message ||
          "Couldn't save your changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const photo = avatar || profile?.avatarUrl;

  return (
    <>
      <style>{`
        .mt-profile-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        .mt-profile-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }
      `}</style>

      <div className="fixed inset-0 z-[120] overflow-hidden">
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close profile"
          onClick={closePanel}
          className={`
            absolute inset-0
            ${
              dark
                ? "bg-black/55 backdrop-blur-[4px]"
                : "bg-black/18 backdrop-blur-[2px]"
            }
            transition-opacity duration-300
            ${visible && !closing ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Right panel */}
        <section
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-title"
          tabIndex={-1}
          style={{
            backgroundColor: COLORS.panel,
            color: COLORS.text,
            borderColor: COLORS.border,
          }}
          className={`
            relative z-10 ml-auto
            flex h-[100dvh]
            w-full max-w-[460px]
            flex-col overflow-hidden border-l
            outline-none
            shadow-[-30px_0_80px_rgba(0,0,0,0.22)]
            transition-transform duration-300
            ease-[cubic-bezier(.22,1,.36,1)]
            ${
              visible && !closing
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >
          {/* Header */}
          <header
            style={{
              backgroundColor: COLORS.panel,
              borderColor: COLORS.border,
            }}
            className="relative z-20 flex shrink-0 items-center justify-between border-b px-6 py-5"
          >
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#D4AF6A]">
                Account
              </p>

              <h2
                id="profile-title"
                className="mt-1 font-serif text-[23px] font-semibold"
                style={{ color: COLORS.text }}
              >
                My Profile
              </h2>

              <p
                className="mt-1 text-[11px]"
                style={{ color: COLORS.muted }}
              >
                Manage your personal information.
              </p>
            </div>

            <button
              type="button"
              onClick={closePanel}
              aria-label="Close profile"
              style={{
                borderColor: COLORS.border,
                color: COLORS.muted,
              }}
              className={`
                grid h-9 w-9 place-items-center
                rounded-xl border transition
                ${
                  dark
                    ? "hover:bg-white/[0.05] hover:text-white"
                    : "hover:bg-black/[0.035] hover:text-[#17221D]"
                }
              `}
            >
              <X size={16} />
            </button>
          </header>

          {/* Scrollable content */}
          <div
            data-lenis-prevent
            className="mt-profile-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
          >
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div
                    className={`
                      mx-auto h-9 w-9 animate-spin
                      rounded-full border-2
                      ${
                        dark
                          ? "border-white/10"
                          : "border-black/10"
                      }
                      border-t-[#D4AF6A]
                    `}
                  />
                  <p
                    className="mt-4 text-xs"
                    style={{
                      color: COLORS.muted,
                    }}
                  >
                    Loading profile...
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSave}
                className="px-6 pb-8 pt-5"
              >
                {/* Identity card */}
                <div
                  style={{
                    backgroundColor: COLORS.card,
                    borderColor: COLORS.border,
                  }}
                  className="relative overflow-hidden rounded-[24px] border p-5"
                >
                  <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-[#D4AF6A]/[0.08] blur-2xl" />

                  <div className="relative flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div
                        style={{
                          backgroundColor: dark
                            ? "#12362D"
                            : "#EDF4EF",
                          borderColor:
                            "rgba(212,175,106,.48)",
                        }}
                        className="h-[94px] w-[94px] overflow-hidden rounded-full border-2 p-[3px] shadow-[0_0_35px_rgba(212,175,106,.08)]"
                      >
                        <div className="h-full w-full overflow-hidden rounded-full">
                          {photo ? (
                            <img
                              src={photo}
                              alt={
                                profile?.fullName ||
                                "Profile"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center">
                              <User
                                size={36}
                                className="text-[#C99643]"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <label
                        htmlFor="profile-avatar-upload"
                        title="Change profile photo"
                        className="absolute bottom-0 right-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-2 border-[#D4AF6A] bg-[#D4AF6A] text-[#241608] shadow-lg transition-transform duration-200 hover:scale-105"
                      >
                        <Camera size={13} />
                      </label>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3
                          className="truncate text-xl font-semibold"
                          style={{
                            color: COLORS.text,
                          }}
                        >
                          {form.fullName || "Your Name"}
                        </h3>
                        <BadgeCheck
                          size={16}
                          className="shrink-0 text-emerald-500"
                        />
                      </div>

                      {profile?.username && (
                        <p
                          className="mt-0.5 text-xs"
                          style={{
                            color: COLORS.muted,
                          }}
                        >
                          @{profile.username}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {profile?.isPremium && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF6A]/30 bg-[#D4AF6A]/[0.08] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#B98636]">
                            <Award size={11} />
                            Premium
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-500">
                          <ShieldCheck size={11} />
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: dark
                        ? "rgba(0,0,0,.16)"
                        : "rgba(255,255,255,.78)",
                      borderColor: COLORS.border,
                    }}
                    className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2.5"
                  >
                    <Sparkles
                      size={13}
                      className="text-[#D4AF6A]"
                    />
                    <p
                      className="text-[10px]"
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      Member since{" "}
                      <span
                        style={{
                          color: COLORS.sub,
                        }}
                      >
                        {profile?.memberSince || "—"}
                      </span>
                    </p>
                  </div>
                </div>

                <input
                  id="profile-avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <label
                  htmlFor="profile-avatar-upload"
                  className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-[10px] font-semibold text-[#A8792D] hover:opacity-70"
                >
                  <Camera size={12} />
                  Change profile photo
                </label>

                {/* Details */}
                <div className="mt-7">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF6A]">
                    Personal details
                  </p>

                  <div className="mt-1 flex items-end justify-between">
                    <div>
                      <h3
                        className="text-base font-semibold"
                        style={{
                          color: COLORS.text,
                        }}
                      >
                        Account Information
                      </h3>
                      <p
                        className="mt-1 text-[10px]"
                        style={{
                          color: COLORS.muted,
                        }}
                      >
                        Keep your account information up to date.
                      </p>
                    </div>

                    <Pencil
                      size={15}
                      className="text-[#D4AF6A]"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-3.5">
                  {FIELDS.map(
                    ([key, label, type, Icon]) => (
                      <label key={key} className="block">
                        <span
                          className="text-[9px] font-bold uppercase tracking-[0.16em]"
                          style={{
                            color: COLORS.muted,
                          }}
                        >
                          {label}
                        </span>

                        <div
                          style={{
                            backgroundColor:
                              COLORS.field,
                            borderColor:
                              COLORS.border,
                          }}
                          className="mt-1.5 flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-all duration-200 focus-within:border-[#D4AF6A]/55"
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[#D4AF6A]/15 bg-[#D4AF6A]/[0.06]">
                            <Icon
                              size={14}
                              className="text-[#B98636]"
                            />
                          </span>

                          <input
                            type={type}
                            value={form[key]}
                            onChange={handleChange(key)}
                            placeholder={label}
                            style={{
                              color: COLORS.text,
                            }}
                            className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                          />

                          <Pencil
                            size={12}
                            className="shrink-0 text-[#D4AF6A]/75"
                          />
                        </div>
                      </label>
                    )
                  )}
                </div>

                {/* KYC */}
                <div
                  style={{
                    backgroundColor: COLORS.card,
                    borderColor: COLORS.border,
                  }}
                  className="mt-5 flex items-center justify-between rounded-2xl border px-4 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/[0.08]">
                      <BadgeCheck
                        size={16}
                        className="text-emerald-500"
                      />
                    </span>

                    <div>
                      <p
                        className="text-xs font-semibold"
                        style={{
                          color: COLORS.text,
                        }}
                      >
                        KYC verification
                      </p>
                      <p
                        className="mt-0.5 text-[10px]"
                        style={{
                          color: COLORS.muted,
                        }}
                      >
                        Identity verification status
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-500">
                    {profile?.kyc || "Verified"}
                  </span>
                </div>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-3.5 py-3">
                    <p className="text-xs leading-relaxed text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div
                  style={{
                    borderColor: COLORS.border,
                  }}
                  className="mt-7 border-t pt-5"
                >
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-[#241608] shadow-[0_10px_30px_rgba(212,175,106,.14)] transition-all duration-200 hover:-translate-y-[1px] hover:brightness-105 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background:
                        "linear-gradient(100deg,#F2C380 0%,#D4AF6A 55%,#D9822F 100%)",
                    }}
                  >
                    <Save size={15} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={closePanel}
                    style={{
                      borderColor:
                        COLORS.border,
                      color: COLORS.sub,
                    }}
                    className={`
                      mt-3 flex w-full
                      items-center justify-center
                      rounded-2xl border
                      py-3.5 text-sm font-medium
                      transition
                      ${
                        dark
                          ? "hover:bg-white/[0.035] hover:text-white"
                          : "hover:bg-black/[0.025] hover:text-[#17221D]"
                      }
                    `}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default ProfilePanelContent;
