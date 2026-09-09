/* pages/dashboard/wallet/WalletAddressModal.jsx: application source file. "Your Wallet Address" modal (QR + copy/share). */
import { useEffect, useState } from "react";

// Third-party QR code generator (client-side, no API calls)
import QRCode from "qrcode";

// lucide-react icons
import { X, Copy, Check, Share2 } from "lucide-react";

// components Modal
import Modal from "../../../components/ui/Modal";

// constants
const GOLD = "#e8b46a";

// Sample receive address for the connected FAIX wallet. Wire this to
// the real connected-wallet address once that data exists.
const WALLET_ADDRESS = "0x7F1aC5G3B6De4960F173Cb8a41b62a98f7E138c9";

/**
 * "Your Wallet Address" modal — QR code + the raw address, with copy
 * and native-share actions. The QR is generated client-side from the
 * address via the `qrcode` package rather than a static image, so it
 * always matches whatever address is wired in above.
 */
export default function WalletAddressModal({ open, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    QRCode.toDataURL(WALLET_ADDRESS, {
      margin: 1,
      width: 240,
      color: { dark: "#141018", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  function handleClose() {
    onClose?.();
    setTimeout(() => setCopied(false), 200);
  }

  function handleCopy() {
    navigator.clipboard?.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: "My Metalan Wallet Address", text: WALLET_ADDRESS }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-serif text-2xl text-white">Your Wallet Address</h2>
          <p className="mt-2 max-w-[300px] text-sm leading-relaxed text-white/50">
            Use this address to receive FAIX tokens on the Metalan network.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      <span
        className="mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
        style={{ borderColor: `${GOLD}66`, color: GOLD }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: GOLD }} />
        FAIX Network
      </span>

      <div className="mt-6 flex justify-center">
        <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-white p-4">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Wallet address QR code" className="h-full w-full" />
          ) : (
            <div className="h-full w-full animate-pulse rounded-lg bg-black/10" />
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#18211E] px-4 py-3">
        <span className="truncate font-mono text-sm text-white/80">{WALLET_ADDRESS}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy address"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
          style={{ borderColor: `${GOLD}66`, color: GOLD }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-[#241608] transition-opacity hover:opacity-90"
        style={{ background: `linear-gradient(90deg, ${GOLD}, #d99a4e)` }}
      >
        <Copy size={15} />
        {copied ? "Copied!" : "Copy Address"}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
      >
        <Share2 size={15} />
        Share Address
      </button>
    </Modal>
  );
}
