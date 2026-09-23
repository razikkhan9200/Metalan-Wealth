import { useEffect, useRef, useState } from "react";

import {
  Bell,
  X,
  Check,
  CheckCheck,
  ArrowUpRight,
  Wallet,
  Building2,
  BriefcaseBusiness,
  ShieldCheck,
  Clock3,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { get } from "../../services/Api";
import { useTheme } from "./shared/ThemeContext";


/* ================================================================
   HELPERS
================================================================ */

function formatNotificationTime(value) {
  if (!value) return "Just now";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const diff = Date.now() - date.getTime();

  const seconds = Math.max(
    Math.floor(diff / 1000),
    0
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes} min${
      minutes === 1 ? "" : "s"
    } ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} hour${
      hours === 1 ? "" : "s"
    } ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days} day${
      days === 1 ? "" : "s"
    } ago`;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


function formatAmount(value) {
  const amount = Number(value || 0);

  return amount.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  );
}


/* ================================================================
   TRANSACTION -> NOTIFICATION
================================================================ */

function transactionToNotification(
  transaction,
  index,
  readIds = new Set()
) {
  const type = String(
    transaction?.type || ""
  ).toLowerCase();

  const asset =
    transaction?.asset ||
    "Transaction";

  const status =
    transaction?.status ||
    "Pending";

  const total =
    Number(transaction?.total || 0);

  let notificationType = "system";
  let title = "Transaction update";
  let message =
    `${asset} transaction has been recorded.`;
  let Icon = ArrowUpRight;


  /* --------------------------------------------------------------
     BUY
  -------------------------------------------------------------- */

  if (
    type === "buy" ||
    type === "purchase"
  ) {
    notificationType = "investment";

    title = "Investment completed";

    message =
      `You purchased ${asset} for ₹${formatAmount(
        total
      )}.`;

    Icon = BriefcaseBusiness;
  }


  /* --------------------------------------------------------------
     SELL
  -------------------------------------------------------------- */

  else if (
    type === "sell" ||
    type === "sale"
  ) {
    notificationType = "investment";

    title = "Investment sold";

    message =
      `Your ${asset} sale of ₹${formatAmount(
        total
      )} has been recorded.`;

    Icon = ArrowUpRight;
  }


  /* --------------------------------------------------------------
     DEPOSIT
  -------------------------------------------------------------- */

  else if (
    type === "deposit" ||
    type === "credit" ||
    type === "add"
  ) {
    notificationType = "wallet";

    title = "Wallet deposit";

    message =
      `₹${formatAmount(
        total
      )} has been added to your wallet.`;

    Icon = Wallet;
  }


  /* --------------------------------------------------------------
     WITHDRAWAL
  -------------------------------------------------------------- */

  else if (
    type === "withdraw" ||
    type === "withdrawal" ||
    type === "debit"
  ) {
    notificationType = "wallet";

    title = "Wallet withdrawal";

    message =
      `₹${formatAmount(
        total
      )} withdrawal has been recorded.`;

    Icon = Wallet;
  }


  /* --------------------------------------------------------------
     PROPERTY
  -------------------------------------------------------------- */

  else if (
    type === "property" ||
    asset
      .toLowerCase()
      .includes("property")
  ) {
    notificationType = "investment";

    title = "Property investment";

    message =
      `Your ${asset} transaction of ₹${formatAmount(
        total
      )} has been recorded.`;

    Icon = Building2;
  }


  /* --------------------------------------------------------------
     FUND
  -------------------------------------------------------------- */

  else if (
    type === "fund" ||
    asset
      .toLowerCase()
      .includes("fund")
  ) {
    notificationType = "fund";

    title = "Fund activity";

    message =
      `${asset} transaction of ₹${formatAmount(
        total
      )} has been recorded.`;

    Icon = BriefcaseBusiness;
  }


  /* --------------------------------------------------------------
     SECURITY / OTHER
  -------------------------------------------------------------- */

  else {
    notificationType = "system";

    title = `${asset} transaction`;

    message =
      `${asset} transaction of ₹${formatAmount(
        total
      )} has been recorded.`;

    Icon = ArrowUpRight;
  }


  return {
    id:
      transaction?._id ||
      transaction?.id ||
      `transaction-${index}`,

    type: notificationType,

    title,

    message:
      `${message} Status: ${status}.`,

    time: formatNotificationTime(
      transaction?.date ||
        transaction?.createdAt
    ),

    /*
      Latest transaction starts unread.
      Existing read state can be handled
      locally through markOneRead.
    */
    unread: !readIds.has(String(
      transaction?._id ||
      transaction?.id ||
      `transaction-${index}`
    )),

    icon: Icon,

    transactionId:
      transaction?._id ||
      transaction?.id,

    transaction,
  };
}


/* ================================================================
   TYPE STYLES
================================================================ */

const TYPE_STYLES = {
  investment: {
    dark: {
      bg: "rgba(212,175,106,.075)",
      border: "rgba(212,175,106,.20)",
      icon: "#D4AF6A",
    },

    light: {
      bg: "rgba(168,121,45,.065)",
      border: "rgba(168,121,45,.17)",
      icon: "#A8792D",
    },
  },

  wallet: {
    dark: {
      bg: "rgba(34,211,238,.065)",
      border: "rgba(34,211,238,.15)",
      icon: "#22D3EE",
    },

    light: {
      bg: "rgba(8,145,178,.06)",
      border: "rgba(8,145,178,.13)",
      icon: "#0891B2",
    },
  },

  fund: {
    dark: {
      bg: "rgba(16,185,129,.065)",
      border: "rgba(16,185,129,.15)",
      icon: "#10B981",
    },

    light: {
      bg: "rgba(5,150,105,.06)",
      border: "rgba(5,150,105,.13)",
      icon: "#059669",
    },
  },

  security: {
    dark: {
      bg: "rgba(139,156,247,.075)",
      border: "rgba(139,156,247,.15)",
      icon: "#8B9CF7",
    },

    light: {
      bg: "rgba(99,102,241,.06)",
      border: "rgba(99,102,241,.13)",
      icon: "#6366F1",
    },
  },

  system: {
    dark: {
      bg: "rgba(148,163,184,.055)",
      border: "rgba(148,163,184,.12)",
      icon: "#94A3B8",
    },

    light: {
      bg: "rgba(100,116,139,.055)",
      border: "rgba(100,116,139,.12)",
      icon: "#64748B",
    },
  },
};


/* ================================================================
   COMPONENT
================================================================ */

export default function NotificationPanel({
  onClose = () => {},
}) {
  const { isDark } = useTheme();

  const panelRef =
    useRef(null);


  /* --------------------------------------------------------------
     STATE
  -------------------------------------------------------------- */

  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [visible, setVisible] =
    useState(false);

  const [closing, setClosing] =
    useState(false);


  /* --------------------------------------------------------------
     UNREAD COUNT
  -------------------------------------------------------------- */

  const unreadCount =
    items.filter(
      (item) => item.unread
    ).length;


  /* --------------------------------------------------------------
     THEME
  -------------------------------------------------------------- */

  const panelBg =
    isDark
      ? "#0A1019"
      : "#FFFFFF";

  const headerBg =
    isDark
      ? "#0A1019"
      : "#FFFFFF";

  const cardBg =
    isDark
      ? "rgba(255,255,255,.025)"
      : "#F8FAF9";

  const border =
    isDark
      ? "rgba(255,255,255,.085)"
      : "rgba(20,35,29,.09)";

  const text =
    isDark
      ? "#F4F7F5"
      : "#17221D";

  const subText =
    isDark
      ? "#C7D0CC"
      : "#34443D";

  const muted =
    isDark
      ? "#738079"
      : "#718078";

  const accent =
    isDark
      ? "#D4AF6A"
      : "#A8792D";

  const iconBg =
    isDark
      ? "rgba(212,175,106,.075)"
      : "rgba(168,121,45,.065)";

  const iconBorder =
    isDark
      ? "rgba(212,175,106,.22)"
      : "rgba(168,121,45,.18)";

  const badgeBg =
    isDark
      ? "#D4AF6A"
      : "#B98A2E";

  const badgeText =
    isDark
      ? "#1A1305"
      : "#FFFFFF";


  /* ================================================================
     LOAD TRANSACTIONS FROM API
  ================================================================ */

  useEffect(() => {
    let mounted = true;

    async function loadTransactions() {
      try {
        setLoading(true);

        let readIds = new Set();
        try {
          const stored = JSON.parse(
            localStorage.getItem("metalan_read_notifications") || "[]"
          );
          if (Array.isArray(stored)) {
            readIds = new Set(stored.map(String));
          }
        } catch {
          readIds = new Set();
        }

        const response = await get(
          "/transactions?page=1&limit=50"
        );

        const payload =
          response?.data?.data ||
          response?.data ||
          response ||
          {};

        const records =
          Array.isArray(
            payload?.records
          )
            ? payload.records
            : Array.isArray(payload)
              ? payload
              : [];


        const notifications =
          records.map(
            (transaction, index) =>
              transactionToNotification(
                transaction,
                index,
                readIds
              )
          );


        if (mounted) {
          setItems(
            notifications
          );
        }
      } catch (error) {
        console.error(
          "Failed to load transaction notifications:",
          error
        );

        if (mounted) {
          setItems([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }


    loadTransactions();


    return () => {
      mounted = false;
    };
  }, []);


  /* ================================================================
     OPEN ANIMATION
  ================================================================ */

  useEffect(() => {
    const id =
      requestAnimationFrame(() => {
        setVisible(true);
      });

    return () =>
      cancelAnimationFrame(id);
  }, []);


  /* ================================================================
     CLOSE
  ================================================================ */

  const closePanel = () => {
    if (closing) return;

    setClosing(true);
    setVisible(false);

    window.setTimeout(() => {
      onClose();
    }, 260);
  };


  /* ================================================================
     KEYBOARD
  ================================================================ */

  useEffect(() => {
    panelRef.current?.focus();

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        closePanel();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
  });


  /* ================================================================
     BODY SCROLL LOCK
  ================================================================ */

  useEffect(() => {
    const body =
      document.body;

    const html =
      document.documentElement;

    const previousBodyOverflow =
      body.style.overflow;

    const previousBodyPadding =
      body.style.paddingRight;

    const previousHtmlOverflow =
      html.style.overflow;

    const scrollbarWidth =
      window.innerWidth -
      html.clientWidth;

    body.style.overflow =
      "hidden";

    html.style.overflow =
      "hidden";

    if (
      scrollbarWidth > 0
    ) {
      body.style.paddingRight =
        `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow =
        previousBodyOverflow;

      body.style.paddingRight =
        previousBodyPadding;

      html.style.overflow =
        previousHtmlOverflow;
    };
  }, []);


  /* ================================================================
     MARK ONE READ
  ================================================================ */

  const markOneRead = (id) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, unread: false }
          : item
      )
    );

    try {
      const stored = JSON.parse(
        localStorage.getItem("metalan_read_notifications") || "[]"
      );
      const readIds = new Set(
        Array.isArray(stored) ? stored.map(String) : []
      );
      readIds.add(String(id));
      localStorage.setItem(
        "metalan_read_notifications",
        JSON.stringify([...readIds])
      );
    } catch {
      // UI state remains updated even when storage is unavailable.
    }
  };


  /* ================================================================
     MARK ALL READ
  ================================================================ */

  const markAllRead = () => {
    setItems((previous) => {
      const ids = previous.map((item) => String(item.id));

      try {
        const stored = JSON.parse(
          localStorage.getItem("metalan_read_notifications") || "[]"
        );
        const readIds = new Set(
          Array.isArray(stored) ? stored.map(String) : []
        );
        ids.forEach((id) => readIds.add(id));
        localStorage.setItem(
          "metalan_read_notifications",
          JSON.stringify([...readIds])
        );
      } catch {
        // UI state remains updated even when storage is unavailable.
      }

      return previous.map((item) => ({
        ...item,
        unread: false,
      }));
    });
  };


  /* ================================================================
     RENDER
  ================================================================ */

  return (
    <>
      <style>{`
        .mt-notification-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          scroll-behavior: smooth;
        }

        .mt-notification-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }
      `}</style>


      <div className="fixed inset-0 z-[125] overflow-hidden">

        {/* =========================================================
            BACKDROP
        ========================================================== */}

        <button
          type="button"
          aria-label="Close notifications"
          onClick={closePanel}
          className={`
            absolute inset-0
            transition-opacity duration-300
            ease-out
            ${
              isDark
                ? "bg-black/55 backdrop-blur-[5px]"
                : "bg-black/16 backdrop-blur-[2px]"
            }
            ${
              visible && !closing
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        />


        {/* =========================================================
            PANEL
        ========================================================== */}

        <section
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="notification-title"
          tabIndex={-1}
          style={{
            backgroundColor:
              panelBg,

            color:
              text,

            borderColor:
              border,
          }}
          className={`
            relative z-10 ml-auto
            flex h-[100dvh]
            w-full max-w-[390px] sm:max-w-[410px]
            flex-col overflow-hidden
            border-l
            outline-none
            shadow-[-35px_0_90px_rgba(0,0,0,0.24)]
            transition-transform duration-300
            ease-[cubic-bezier(.22,1,.36,1)]
            ${
              visible && !closing
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >

          {/* =======================================================
              DECORATIVE GLOW
          ======================================================== */}

          <div
            className="
              pointer-events-none absolute
              -right-20 -top-20
              h-52 w-52 rounded-full
              bg-[#D4AF6A]/[0.06]
              blur-3xl
            "
          />


          {/* =======================================================
              HEADER
          ======================================================== */}

          <header
            style={{
              backgroundColor:
                headerBg,

              borderColor:
                border,
            }}
            className="
              relative z-20 shrink-0
              border-b px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5
            "
          >

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div
                  style={{
                    backgroundColor:
                      isDark
                        ? "rgba(212,175,106,.075)"
                        : "rgba(168,121,45,.065)",

                    borderColor:
                      isDark
                        ? "rgba(212,175,106,.22)"
                        : "rgba(168,121,45,.18)",
                  }}
                  className="
                    relative grid h-10 w-10
                    shrink-0 place-items-center
                    rounded-[14px] border
                  "
                >

                  <Bell
                    size={17}
                    style={{
                      color: accent,
                    }}
                  />


                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute -right-1.5 -top-1.5
                        grid h-5 min-w-5
                        place-items-center
                        rounded-full
                        bg-[#D4AF6A]
                        px-1
                        text-[9px]
                        font-bold
                        text-[#1A1305]
                      "
                    >
                      {unreadCount}
                    </span>
                  )}

                </div>


                <div>

                  <div className="flex items-center gap-2">

                    <p
                      style={{
                        color: accent,
                      }}
                      className="
                        text-[9px] font-bold uppercase
                        tracking-[0.24em]
                      "
                    >
                      Account center
                    </p>


                  </div>


                  <h2
                    id="notification-title"
                    style={{
                      color: text,
                    }}
                    className="
                      mt-1 font-serif
                      text-[21px] font-semibold
                      tracking-[-0.01em]
                    "
                  >
                    Notifications
                  </h2>


                  <p
                    style={{
                      color: muted,
                    }}
                    className="mt-1 text-[11px]"
                  >
                    Latest activity from your account.
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={closePanel}
                aria-label="Close notifications"
                style={{
                  borderColor:
                    border,

                  color:
                    muted,
                }}
                className={`
                  grid h-9 w-9 shrink-0
                  place-items-center rounded-xl
                  border transition-all duration-200
                  ${
                    isDark
                      ? "hover:bg-white/[0.05] hover:text-white"
                      : "hover:bg-black/[0.035] hover:text-[#17221D]"
                  }
                `}
              >
                <X size={16} />
              </button>

            </div>


            {/* =====================================================
                SUMMARY STRIP
            ====================================================== */}

            <div
              style={{
                backgroundColor:
                  isDark
                    ? "rgba(255,255,255,.018)"
                    : "#F8FAF9",

                borderColor:
                  border,
              }}
              className="
                mt-4 flex items-center
                justify-between rounded-2xl
                border px-4 py-3
              "
            >

              <div className="flex items-center gap-2.5">

                <span
                  className="
                    h-2 w-2 rounded-full
                    bg-emerald-500
                    shadow-[0_0_10px_rgba(16,185,129,.35)]
                  "
                />

                <span
                  style={{
                    color: subText,
                  }}
                  className="
                    text-[10px] font-medium
                  "
                >
                  {loading
                    ? "Loading activity"
                    : unreadCount > 0
                      ? `${unreadCount} unread`
                      : "All caught up"}
                </span>

              </div>


              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  style={{
                    color: accent,
                  }}
                  className="
                    inline-flex items-center gap-1.5
                    rounded-lg px-1.5 py-0.5
                    text-[8px] font-medium
                    transition
                    hover:bg-[#D4AF6A]/[0.08]
                  "
                >
                  <CheckCheck size={7} />
                  Mark all read
                </button>
              )}

            </div>

          </header>


          {/* =========================================================
              SCROLL AREA
          ========================================================== */}

          <div
            data-lenis-prevent
            className="
              mt-notification-scroll
              min-h-0 flex-1
              overflow-y-auto
              overflow-x-hidden
              px-3.5 py-4 sm:px-4 sm:py-5
            "
          >

            {/* =======================================================
                LOADING
            ======================================================== */}

            {loading ? (

              <div
                className="
                  flex min-h-[420px]
                  flex-col items-center
                  justify-center text-center
                "
              >

                <div
                  style={{
                    backgroundColor:
                      isDark
                        ? "rgba(212,175,106,.07)"
                        : "rgba(168,121,45,.055)",

                    borderColor:
                      border,
                  }}
                  className="
                    grid h-[72px] w-[72px]
                    place-items-center
                    rounded-[22px] border
                  "
                >
                  <Bell
                    size={25}
                    style={{
                      color: accent,
                    }}
                  />
                </div>


                <p
                  style={{
                    color: text,
                  }}
                  className="
                    mt-5 text-[15px]
                    font-semibold
                  "
                >
                  Loading activity
                </p>


                <p
                  style={{
                    color: muted,
                  }}
                  className="
                    mt-1.5 max-w-[265px]
                    text-[11px]
                    leading-relaxed
                  "
                >
                  Fetching your latest transactions.
                </p>

              </div>


            ) : items.length === 0 ? (

              /* =====================================================
                 EMPTY
              ====================================================== */

              <div
                className="
                  flex min-h-[420px]
                  flex-col items-center
                  justify-center
                  text-center
                "
              >

                <div
                  style={{
                    backgroundColor:
                      isDark
                        ? "rgba(212,175,106,.07)"
                        : "rgba(168,121,45,.055)",

                    borderColor:
                      border,
                  }}
                  className="
                    grid h-[72px] w-[72px]
                    place-items-center
                    rounded-[22px] border
                  "
                >
                  <Bell
                    size={25}
                    style={{
                      color: accent,
                    }}
                  />
                </div>


                <p
                  style={{
                    color: text,
                  }}
                  className="
                    mt-5 text-[15px]
                    font-semibold
                  "
                >
                  You're all caught up
                </p>


                <p
                  style={{
                    color: muted,
                  }}
                  className="
                    mt-1.5 max-w-[265px]
                    text-[11px]
                    leading-relaxed
                  "
                >
                  New wallet, fund and investment
                  activity will appear here.
                </p>

              </div>


            ) : (

              /* =====================================================
                 TRANSACTION NOTIFICATIONS
              ====================================================== */

              <div className="space-y-3">

                {items.map((item) => {

                  const Icon =
                    item.icon || Bell;

                  const palette =
                    TYPE_STYLES[
                      item.type
                    ] ||
                    TYPE_STYLES.system;

                  const iconStyle =
                    isDark
                      ? palette.dark
                      : palette.light;


                  return (
                    <article
                      key={item.id}
                      style={{
                        backgroundColor:
                          cardBg,

                        borderColor:
                          item.unread
                            ? isDark
                              ? "rgba(212,175,106,.18)"
                              : "rgba(168,121,45,.16)"
                            : border,

                        boxShadow:
                          isDark
                            ? "0 10px 26px rgba(0,0,0,.08)"
                            : "0 8px 22px rgba(20,35,29,.03)",
                      }}
                      className="
                        group relative
                        overflow-hidden
                        rounded-[16px]
                        border
                        transition-all duration-200
                        hover:-translate-y-[1px]
                      "
                    >

                      <div className="flex gap-2.5 p-3">

                        {/* =================================================
                            ICON
                        ================================================== */}

                        <div
                          style={{
                            backgroundColor:
                              iconStyle.bg,

                            borderColor:
                              iconStyle.border,
                          }}
                          className="
                            relative mt-0.5
                            grid h-9 w-9
                            shrink-0 place-items-center
                            rounded-[12px] border
                          "
                        >

                          <Icon
                            size={16}
                            style={{
                              color:
                                iconStyle.icon,
                            }}
                          />


                          {item.unread && (
                            <span
                              style={{
                                backgroundColor:
                                  accent,

                                boxShadow:
                                  "0 0 9px rgba(212,175,106,.35)",
                              }}
                              className="
                                absolute -right-1 -top-1
                                h-2 w-2 rounded-full
                              "
                            />
                          )}

                        </div>


                        {/* =================================================
                            CONTENT
                        ================================================== */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <div className="min-w-0">

                              <h3
                                style={{
                                  color: text,
                                }}
                                className="
                                  truncate
                                  text-[12px]
                                  font-semibold
                                  leading-5
                                "
                              >
                                {item.title}
                              </h3>


                              <span
                                style={{
                                  color: muted,
                                }}
                                className="
                                  mt-0.5 block
                                  text-[7px]
                                  font-medium
                                  uppercase
                                  tracking-[0.12em]
                                "
                              >
                                {item.type ===
                                "investment"
                                  ? "Investment"
                                  : item.type ===
                                      "wallet"
                                    ? "Wallet"
                                    : item.type ===
                                        "fund"
                                      ? "Fund"
                                      : item.type ===
                                          "security"
                                        ? "Security"
                                        : "Transaction"}
                              </span>

                            </div>


                            {item.unread && (
                              <span
                                style={{
                                  color: accent,

                                  borderColor:
                                    isDark
                                      ? "rgba(212,175,106,.20)"
                                      : "rgba(168,121,45,.18)",
                                }}
                                className="
                                  shrink-0 rounded-full
                                  border px-2 py-0.5
                                  text-[8px] font-semibold
                                "
                              >
                                NEW
                              </span>
                            )}

                          </div>


                          <p
                            style={{
                              color: isDark
                                ? "#96A19C"
                                : "#66736D",
                            }}
                            className="
                              mt-1
                              text-[10px]
                              leading-[1.55]
                            "
                          >
                            {item.message}
                          </p>


                          {/* =================================================
                              FOOTER
                          ================================================== */}

                          <div
                            className="
                              mt-2.5 flex
                              items-center justify-between
                              gap-2
                            "
                          >

                            <span
                              style={{
                                color: muted,
                              }}
                              className="
                                inline-flex
                                items-center gap-1.5
                                text-[8px]
                              "
                            >
                              <Clock3 size={9} />

                              {item.time}
                            </span>


                            {item.unread ? (
                              <button
                                type="button"
                                onClick={() => markOneRead(item.id)}
                                style={{ color: accent }}
                                className="
                                  inline-flex items-center gap-1
                                  rounded-md px-1.5 py-0.5
                                  text-[7px] font-medium
                                  opacity-100 transition-colors
                                  hover:bg-[#D4AF6A]/[0.08]
                                "
                              >
                                <Check size={3} />
                                Mark read
                              </button>
                            ) : (
                              <span
                                style={{ color: muted }}
                                className="
                                  inline-flex items-center gap-1
                                  text-[8px] font-medium
                                "
                              >
                                <Check size={9} />
                                Read
                              </span>
                            )}

                          </div>

                        </div>


                        {/* =================================================
                            CHEVRON
                        ================================================== */}

                        <ChevronRight
                          size={13}
                          style={{
                            color: isDark
                              ? "#465149"
                              : "#AFB8B4",
                          }}
                          className="
                            pointer-events-none
                            absolute bottom-3.5 right-3
                            opacity-0
                            transition-opacity
                            duration-200
                            group-hover:opacity-100
                          "
                        />

                      </div>

                    </article>
                  );
                })}


                <div className="h-3" />

              </div>

            )}

          </div>


          {/* =========================================================
              FOOTER
          ========================================================== */}

          <footer
            style={{
              backgroundColor:
                headerBg,

              borderColor:
                border,
            }}
            className="
              relative z-10
              shrink-0 border-t
              px-4 py-4
            "
          >

            <button
              type="button"
              onClick={closePanel}
              style={{
                borderColor:
                  border,

                color:
                  subText,
              }}
              className={`
                flex w-full
                items-center justify-center
                gap-2 rounded-xl
                border py-3
                text-xs font-semibold
                transition-all duration-200
                ${
                  isDark
                    ? "hover:bg-white/[0.035] hover:text-white"
                    : "hover:bg-black/[0.025] hover:text-[#17221D]"
                }
              `}
            >
              Close
            </button>

          </footer>

        </section>

      </div>
    </>
  );
}