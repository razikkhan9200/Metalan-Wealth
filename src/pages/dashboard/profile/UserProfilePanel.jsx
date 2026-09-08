// /* components/ui/UserProfilePanel.jsx: application source file. Slide-in "My Profile" edit panel. */
// import { useEffect, useRef, useState } from "react";
// import { User, X, Pencil, Award } from "lucide-react";

// import { getProfile, updateProfile } from "../../../services/UserService";

// const ACCENT = "#1A3C34";
// const GOLD = "#e8b46a";

// // Shown immediately if the profile fetch fails (e.g. no backend running
// // yet) so the panel still has something to display instead of a blank
// // shell — this matches the reference design's sample data exactly.
// // Delete this fallback once the /users/me endpoint is live and this
// // path never actually gets hit.
// const FALLBACK_PROFILE = {
//   fullName: "Alexander Mitchell",
//   username: "alex_mitchell",
//   email: "alex.mitchell@email.com",
//   phone: "+1 (555) 234-5678",
//   dateOfBirth: "March 15, 1992",
//   country: "United States",
//   avatarUrl: null,
//   isPremium: true,
//   memberSince: "March 2024",
// };

// // Every editable row in the panel, in display order. Centralizing this
// // (label + which `profile`/`form` key it reads/writes + input `type`)
// // means the JSX below is one `.map()` instead of five nearly-identical
// // hand-written blocks — add a new field here and it appears in the
// // form automatically.
// const FIELDS = [
//   { key: "fullName", label: "Full Name", type: "text" },
//   { key: "email", label: "Email Address", type: "email" },
//   { key: "phone", label: "Phone Number", type: "tel" },
//   { key: "dateOfBirth", label: "Date of Birth", type: "text" },
//   { key: "country", label: "Country", type: "text" },
// ];

// /**
//  * Self-contained profile icon button + its slide-in edit panel. Like
//  * the earlier UserProfileMenu, this owns its own open/closed state —
//  * DashboardNavbar just renders `<UserProfilePanel />` with no props and
//  * no state of its own to manage.
//  *
//  * Data flow:
//  * - On open, fetches the real profile via userService.getProfile().
//  *   Falls back to FALLBACK_PROFILE (matching the reference design's
//  *   sample data) if that call fails, so the UI is still fully visible
//  *   and interactive before a backend exists.
//  * - Every field is a live, always-editable input (not a read-only row
//  *   that toggles into edit mode) — the pencil icon next to each one is
//  *   a visual affordance rather than a separate interaction, which
//  *   keeps the form's state model to one plain object instead of also
//  *   tracking "which field is currently being edited."
//  * - "Save Changes" calls userService.updateProfile() with just the
//  *   five editable fields, then closes the panel on success.
//  */
// export default function UserProfilePanel() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <button
//         type="button"
//         onClick={() => setIsOpen(true)}
//         aria-haspopup="dialog"
//         aria-expanded={isOpen}
//         aria-label="Open my profile"
//         className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-white/10 transition-colors hover:ring-white/30"
//         style={{ background: `${ACCENT}88` }}
//       >
//         <User size={18} className="text-[#e8b46a]" />
//       </button>

//       {isOpen && <ProfilePanelContent onClose={() => setIsOpen(false)} />}
//     </>
//   );
// }

// function ProfilePanelContent({ onClose }) {
//   const panelRef = useRef(null);

//   const [profile, setProfile] = useState(null);
//   const [form, setForm] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);

//   // Load the real profile the moment the panel opens, rather than
//   // whenever UserProfilePanel first mounts — the trigger button always
//   // exists in the navbar, but there's no reason to hit the API before
//   // the person has actually asked to see their profile.
//   useEffect(() => {
//     let cancelled = false;

//     getProfile()
//       .then((data) => {
//         if (cancelled) return;
//         setProfile(data);
//         setForm(toFormFields(data));
//       })
//       .catch(() => {
//         if (cancelled) return;
//         // No backend yet (or the request failed) — fall back to sample
//         // data so the panel still renders and can be interacted with.
//         setProfile(FALLBACK_PROFILE);
//         setForm(toFormFields(FALLBACK_PROFILE));
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // Close on Escape and focus the panel on open, matching
//   // UserProfileMenu's dialog behavior for keyboard/screen-reader users.
//   useEffect(() => {
//     panelRef.current?.focus();
//     const handleKeyDown = (event) => {
//       if (event.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [onClose]);

//   const handleFieldChange = (key) => (event) => {
//     setForm((previous) => ({ ...previous, [key]: event.target.value }));
//   };

//   // Only previews the image locally for now — see userService.js's
//   // uploadAvatar() docstring for what's needed to make this actually
//   // persist to the backend.
//   const handleAvatarChange = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//     setAvatarPreview(URL.createObjectURL(file));
//   };

//   const handleSave = async (event) => {
//     event.preventDefault();
//     setSaving(true);
//     setError(null);

//     try {
//       const updated = await updateProfile(form);
//       setProfile((previous) => ({ ...previous, ...updated }));
//       onClose();
//     } catch (err) {
//       setError(err.message || "Couldn't save your changes. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
//       {/* Backdrop — click to close, same as UserProfileMenu's modal. */}
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

//       <div
//         ref={panelRef}
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="profile-panel-title"
//         tabIndex={-1}
//         className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-[#121212] shadow-[-40px_0_90px_-15px_rgba(0,0,0,0.85)]"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 pt-6">
//           <h2 id="profile-panel-title" className="font-serif text-xl text-white">
//             My Profile
//           </h2>
//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close"
//             className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors hover:border-white/30 hover:text-white"
//           >
//             <X size={15} />
//           </button>
//         </div>

//         {loading || !form ? (
//           <div className="flex flex-1 items-center justify-center">
//             <p className="text-sm text-white/40">Loading profile…</p>
//           </div>
//         ) : (
//           <form onSubmit={handleSave} className="flex flex-1 flex-col px-6 pb-6">
//             {/* Identity header: avatar, name, username, premium badge */}
//             <div className="flex flex-col items-center pt-6 text-center">
//               <div className="relative">
//                 <span
//                   className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full ring-2"
//                   style={{ "--tw-ring-color": GOLD, background: `${ACCENT}88` }}
//                 >
//                   {avatarPreview || profile.avatarUrl ? (
//                     <img
//                       src={avatarPreview || profile.avatarUrl}
//                       alt=""
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <User size={40} className="text-[#e8b46a]" />
//                   )}
//                 </span>
//               </div>

//               <label className="mt-3 cursor-pointer text-sm font-medium underline" style={{ color: GOLD }}>
//                 Change Photo
//                 <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
//               </label>

//               <p className="mt-3 text-xl font-bold text-white">{form.fullName}</p>
//               {profile.username && <p className="text-sm text-white/40">@{profile.username}</p>}

//               {profile.isPremium && (
//                 <span
//                   className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide"
//                   style={{ borderColor: `${GOLD}80`, color: GOLD }}
//                 >
//                   <Award size={12} />
//                   PREMIUM MEMBER
//                 </span>
//               )}

//               {profile.memberSince && (
//                 <p className="mt-2 text-xs text-white/40">Member since {profile.memberSince}</p>
//               )}
//             </div>

//             {/* Editable fields */}
//             <div className="mt-6 space-y-4">
//               {FIELDS.map((field) => (
//                 <label key={field.key} className="block">
//                   <span className="text-[11px] font-medium tracking-[0.1em] text-white/40">
//                     {field.label.toUpperCase()}
//                   </span>
//                   <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3.5 py-3">
//                     <input
//                       type={field.type}
//                       value={form[field.key]}
//                       onChange={handleFieldChange(field.key)}
//                       className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
//                     />
//                     <Pencil size={13} className="shrink-0" style={{ color: GOLD }} />
//                   </div>
//                 </label>
//               ))}
//             </div>

//             {error && (
//               <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">
//                 {error}
//               </p>
//             )}

//             <div className="mt-6 border-t border-white/10 pt-5">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="w-full rounded-xl py-3 text-sm font-bold text-[#241608] transition-all hover:brightness-105 disabled:opacity-60"
//                 style={{ background: `linear-gradient(90deg, #f2c380, ${GOLD}, #d9822f)` }}
//               >
//                 {saving ? "Saving…" : "Save Changes"}
//               </button>

//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="mt-3 w-full rounded-xl border border-white/15 py-3 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:bg-white/5"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// /** Picks just the editable keys out of a full profile object, since
//  * `form` should never carry read-only fields like `username` or
//  * `isPremium` that the save button isn't allowed to change. */
// function toFormFields(profile) {
//   return FIELDS.reduce((form, field) => {
//     form[field.key] = profile[field.key] ?? "";
//     return form;
//   }, {});
// }






/* components/ui/UserProfilePanel.jsx */

import { useEffect, useRef, useState } from "react";
import { User, X, Pencil, Award } from "lucide-react";

import {
  getProfile,
  updateProfile,
} from "../../../services/UserService";

import { toast } from "../../../utils/toast";

const ACCENT = "#1A3C34";
const GOLD = "#e8b46a";

/* ======================================================
   FALLBACK PROFILE
====================================================== */

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
};

/* ======================================================
   EDITABLE FIELDS
====================================================== */

const FIELDS = [
  {
    key: "fullName",
    label: "Full Name",
    type: "text",
  },
  {
    key: "email",
    label: "Email Address",
    type: "email",
  },
  {
    key: "phone",
    label: "Phone Number",
    type: "tel",
  },
  {
    key: "dateOfBirth",
    label: "Date of Birth",
    type: "text",
  },
  {
    key: "country",
    label: "Country",
    type: "text",
  },
];

/* ======================================================
   MAIN COMPONENT
====================================================== */

export default function UserProfilePanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* PROFILE BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Open my profile"
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          ring-1
          ring-white/10
          transition-all
          duration-300
          hover:scale-105
          hover:ring-white/30
        "
        style={{
          background: `${ACCENT}88`,
        }}
      >
        <User
          size={18}
          className="text-[#e8b46a]"
        />
      </button>

      {/* PROFILE PANEL */}
      {isOpen && (
        <ProfilePanelContent
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

/* ======================================================
   PROFILE PANEL CONTENT
====================================================== */

function ProfilePanelContent({ onClose }) {
  const panelRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState(null);

  const [avatarPreview, setAvatarPreview] =
    useState(null);

  /* ====================================================
     LOAD PROFILE
  ==================================================== */

  useEffect(() => {
    let cancelled = false;

    getProfile()
      .then((data) => {
        if (cancelled) return;

        setProfile(data);
        setForm(toFormFields(data));
      })
      .catch(() => {
        if (cancelled) return;

        setProfile(FALLBACK_PROFILE);

        setForm(
          toFormFields(FALLBACK_PROFILE)
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ====================================================
     LOCK BACKGROUND SCROLL
  ==================================================== */

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    const previousBodyOverflow =
      body.style.overflow;

    const previousHtmlOverflow =
      html.style.overflow;

    const previousBodyPaddingRight =
      body.style.paddingRight;

    /*
      Scrollbar disappear hone par page jump na kare,
      isliye scrollbar width calculate kar rahe hain.
    */
    const scrollbarWidth =
      window.innerWidth -
      document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    /*
      Desktop par body width shift prevent karta hai.
    */
    if (scrollbarWidth > 0) {
      body.style.paddingRight =
        `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow =
        previousBodyOverflow;

      html.style.overflow =
        previousHtmlOverflow;

      body.style.paddingRight =
        previousBodyPaddingRight;
    };
  }, []);

  /* ====================================================
     ESC KEY CLOSE
  ==================================================== */

  useEffect(() => {
    panelRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  /* ====================================================
     INPUT CHANGE
  ==================================================== */

  const handleFieldChange =
    (key) => (event) => {
      setForm((previous) => ({
        ...previous,
        [key]: event.target.value,
      }));
    };

  /* ====================================================
     AVATAR CHANGE
  ==================================================== */

  const handleAvatarChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (avatarPreview) {
      URL.revokeObjectURL(
        avatarPreview
      );
    }

    const imageUrl =
      URL.createObjectURL(file);

    setAvatarPreview(imageUrl);
  };

  /* ====================================================
     CLEAN AVATAR URL
  ==================================================== */

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(
          avatarPreview
        );
      }
    };
  }, [avatarPreview]);

  /* ====================================================
     SAVE PROFILE
  ==================================================== */

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const updated = await toast.promise(updateProfile(form), {
        loading: "Saving your changes...",
        success: "Profile updated.",
        error: (err) => err?.message || "Couldn't save your changes. Please try again.",
      });

      setProfile((previous) => ({
        ...previous,
        ...updated,
      }));

      onClose();
    } catch (err) {
      // toast.promise already surfaced this; also mirror it inline
      // on the panel for anyone who missed the toast.
      setError(
        err?.message ||
          "Couldn't save your changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ====================================================
     UI
  ==================================================== */

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        justify-end
        overflow-hidden
      "
      role="presentation"
    >
      {/* =================================================
          BACKDROP
      ================================================= */}

      <div
        className="
          absolute
          inset-0
          bg-black/60
          backdrop-blur-sm
        "
        onClick={onClose}
        aria-hidden="true"
      />

      {/* =================================================
          RIGHT SIDE PANEL
      ================================================= */}

      <div
          ref={panelRef}
        onWheel={(e) => {
          e.stopPropagation();
          panelRef.current.scrollTop += e.deltaY;
        }}
        className="
          profile-scroll
          relative
          z-10
          flex
          h-[100dvh]
          max-h-[100dvh]
          w-full
          max-w-md
          flex-col
          overflow-y-auto
          border-l
          border-white/10
          bg-[#121212]
          outline-none
        "
      >
        {/* =================================================
            FIXED HEADER
        ================================================= */}

        <div
          className="
            shrink-0
            border-b
            border-white/10
            bg-[#121212]
            px-6
            py-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h2
                id="profile-panel-title"
                className="
                  font-serif
                  text-xl
                  font-semibold
                  text-white
                "
              >
                My Profile
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-white/40
                "
              >
                Manage your personal information
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-white/15
                text-white/50
                transition-all
                duration-300
                hover:border-white/30
                hover:bg-white/5
                hover:text-white
              "
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading || !form ? (
          <div
            className="
              flex
              min-h-0
              flex-1
              items-center
              justify-center
            "
          >
            <div className="text-center">
              <div
                className="
                  mx-auto
                  mb-4
                  h-8
                  w-8
                  animate-spin
                  rounded-full
                  border-2
                  border-white/10
                  border-t-[#e8b46a]
                "
              />

              <p
                className="
                  text-sm
                  text-white/40
                "
              >
                Loading profile...
              </p>
            </div>
          </div>
        ) : (
          /* =================================================
             ONLY THIS AREA SCROLLS
          ================================================= */

          <form
            onSubmit={handleSave}
            className="
              px-6
          pb-8
            "
            style={{
              WebkitOverflowScrolling:
                "touch",

              scrollbarWidth:
                "thin",

              scrollbarColor:
                "#555 transparent",
            }}
          >
            {/* ===============================================
                PROFILE AVATAR
            =============================================== */}

            <div
              className="
                flex
                flex-col
                items-center
                pt-7
                text-center
              "
            >
              <div className="relative">
                <div
                  className="
                    flex
                    h-28
                    w-28
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    ring-2
                  "
                  style={{
                    "--tw-ring-color":
                      GOLD,

                    background:
                      `${ACCENT}88`,
                  }}
                >
                  {avatarPreview ||
                  profile.avatarUrl ? (
                    <img
                      src={
                        avatarPreview ||
                        profile.avatarUrl
                      }
                      alt="Profile"
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  ) : (
                    <User
                      size={42}
                      className="text-[#e8b46a]"
                    />
                  )}
                </div>

                <div
                  className="
                    absolute
                    bottom-1
                    right-1
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-[#121212]
                  "
                  style={{
                    background: GOLD,
                  }}
                >
                  <Pencil
                    size={13}
                    className="text-[#241608]"
                  />
                </div>
              </div>

              {/* CHANGE PHOTO */}

              <label
                className="
                  mt-4
                  cursor-pointer
                  text-sm
                  font-medium
                  transition-opacity
                  hover:opacity-70
                "
                style={{
                  color: GOLD,
                }}
              >
                Change Photo

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleAvatarChange
                  }
                  className="hidden"
                />
              </label>

              {/* NAME */}

              <p
                className="
                  mt-4
                  text-xl
                  font-bold
                  text-white
                "
              >
                {form.fullName}
              </p>

              {/* USERNAME */}

              {profile.username && (
                <p
                  className="
                    mt-1
                    text-sm
                    text-white/40
                  "
                >
                  @{profile.username}
                </p>
              )}

              {/* PREMIUM */}

              {profile.isPremium && (
                <span
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-[11px]
                    font-semibold
                    tracking-wide
                  "
                  style={{
                    borderColor:
                      `${GOLD}80`,

                    color: GOLD,
                  }}
                >
                  <Award size={12} />
                  PREMIUM MEMBER
                </span>
              )}

              {/* MEMBER SINCE */}

              {profile.memberSince && (
                <p
                  className="
                    mt-2
                    text-xs
                    text-white/40
                  "
                >
                  Member since{" "}
                  {profile.memberSince}
                </p>
              )}
            </div>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <div
              className="
                my-7
                h-px
                bg-white/10
              "
            />

            {/* =================================================
                SECTION TITLE
            ================================================= */}

            <div>
              <h3
                className="
                  text-sm
                  font-semibold
                  text-white
                "
              >
                Personal Information
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-white/40
                "
              >
                Update your personal details below.
              </p>
            </div>

            {/* =================================================
                INPUT FIELDS
            ================================================= */}

            <div
              className="
                mt-5
                space-y-4
              "
            >
              {FIELDS.map((field) => (
                <label
                  key={field.key}
                  className="block"
                >
                  <span
                    className="
                      text-[11px]
                      font-medium
                      tracking-[0.1em]
                      text-white/40
                    "
                  >
                    {field.label.toUpperCase()}
                  </span>

                  <div
                    className="
                      mt-1.5
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      bg-black/40
                      px-3.5
                      py-3
                      transition-all
                      duration-300
                      focus-within:border-[#e8b46a]/60
                      focus-within:bg-black/60
                    "
                  >
                    <input
                      type={field.type}
                      value={
                        form[field.key]
                      }
                      onChange={
                        handleFieldChange(
                          field.key
                        )
                      }
                      className="
                        w-full
                        bg-transparent
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-white/30
                      "
                    />

                    <Pencil
                      size={13}
                      className="shrink-0"
                      style={{
                        color: GOLD,
                      }}
                    />
                  </div>
                </label>
              ))}
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <p
                className="
                  mt-5
                  rounded-lg
                  border
                  border-red-400/30
                  bg-red-400/10
                  px-3
                  py-2.5
                  text-xs
                  text-red-300
                "
              >
                {error}
              </p>
            )}

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div
              className="
                mt-7
                border-t
                border-white/10
                pt-5
              "
            >
              {/* SAVE */}

              <button
                type="submit"
                disabled={saving}
                className="
                  w-full
                  rounded-xl
                  py-3.5
                  text-sm
                  font-bold
                  text-[#241608]
                  transition-all
                  duration-300
                  hover:brightness-105
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
                style={{
                  background:
                    `linear-gradient(
                      90deg,
                      #f2c380,
                      ${GOLD},
                      #d9822f
                    )`,
                }}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              {/* CANCEL */}

              <button
                type="button"
                onClick={onClose}
                className="
                  mt-3
                  w-full
                  rounded-xl
                  border
                  border-white/15
                  py-3.5
                  text-sm
                  font-medium
                  text-white/70
                  transition-all
                  duration-300
                  hover:border-white/30
                  hover:bg-white/5
                  hover:text-white
                "
              >
                Cancel
              </button>
            </div>

            {/* BOTTOM SPACE */}

            <div className="h-4" />
          </form>
        )}
      </div>
    </div>
  );
}

/* ======================================================
   PROFILE DATA → FORM DATA
====================================================== */

function toFormFields(profile) {
  return FIELDS.reduce(
    (form, field) => {
      form[field.key] =
        profile[field.key] ?? "";

      return form;
    },
    {}
  );
}

