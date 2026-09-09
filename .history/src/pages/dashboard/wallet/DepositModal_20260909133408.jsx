/* pages/dashboard/wallet/DepositModal.jsx: application source file. Deposit Funds modal (form + success steps). */
import { useState } from "react";

// lucide-react icons
import { ArrowDownLeft, X, CheckCircle2, Copy, Check } from "lucide-react";

// components Modal
import Modal from "../../../components/ui/Modal";

// constants
const GOLD = "#e8b46a";

// Sample deposit-source balance — this is the external/connected wallet
// balance being deposited *from*, not the in-app FAIX balance shown in
// the navbar, so it's deliberately a different number.
const AVAILABLE_TO_DEPOSIT = "50,000.00";
const NETWORK_FEE = "1.00 FAIX";
const PROCESSING_TIME = "~2 minutes";

/**
 * Deposit Funds modal.
 *
 * Two steps: `form` collects the amount, then `success` shows a
 * confirmation receipt. `onClose` resets back to `form` so the next
 * time this opens it starts clean rather than resuming on the receipt.
 */
export default function DepositModal({ open, onClose }) {
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState("2,000.00");

  function handleClose() {
    onClose?.();
    // Reset after the close animation/tick so the form doesn't visibly
    // flash back to its default state before the modal unmounts.
    setTimeout(() => setStep("form"), 200);
  }

  function handleConfirm(event) {
    event.preventDefault();
    // TODO(deposit-api): submit { amount, asset: "FAIX", network } to
    // the deposit endpoint once it exists; this just advances to the
    // receipt step locally for now.
    setStep("success");
  }

  return (
    <Modal open={open} onClose={handleClose}>
      {step === "form" ? (
        <DepositForm amount={amount} onAmountChange={setAmount} onClose={handleClose} onConfirm={handleConfirm} />
      ) : (
        <DepositSuccess amount={amount} onClose={handleClose} />
      )}
    </Modal>
  );
}

function DepositForm({ amount, onAmountChange, onClose, onConfirm }) {
  return (
    <form onSubmit={onConfirm}>
      <div className="flex items-center justify-between pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${GOLD}1f`, color: GOLD }}>
            <ArrowDownLeft size={16} />
          </span>
          <h2 className="font-serif text-2xl text-white">Deposit Funds</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
      <div className="border-t border-white/10" />

      <div className="mt-5">
        <p className="text-xs font-semibold tracking-wide text-white/40">SELECT ASSET</p>
        {/* Single supported asset today, so this is a static display
            rather than a real dropdown — swap for a proper select once
            more than one deposit asset is supported. */}
        <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-[#18211E] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-6 rounded-full" style={{ background: GOLD }} />
            <span className="text-sm font-semibold text-white">FAIX</span>
            <span className="text-sm text-white/40">Metalan Stablecoin</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/40">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide text-white/40">AMOUNT</p>
          <p className="text-xs text-white/40">Available: {AVAILABLE_TO_DEPOSIT} FAIX</p>
        </div>
        <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-[#18211E] px-4 py-3">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent font-mono text-lg font-bold text-white outline-none"
          />
          <button
            type="button"
            onClick={() => onAmountChange(AVAILABLE_TO_DEPOSIT)}
            className="shrink-0 rounded-md border px-2.5 py-1 text-xs font-bold"
            style={{ borderColor: `${GOLD}99`, color: GOLD }}
          >
            MAX
          </button>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold tracking-wide text-white/40">SELECT NETWORK</p>
        {/* Only one deposit network today — shown as an active/selected
            pill rather than a real picker, same reasoning as the asset
            field above. */}
        <div
          className="mt-2 rounded-xl border py-3 text-center text-sm font-semibold"
          style={{ borderColor: `${GOLD}66`, background: "#1A3C3455", color: GOLD }}
        >
          Metalan Network
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-[#18211E] p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Network Fee</span>
          <span className="font-mono text-white">{NETWORK_FEE}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-white/40">Processing Time</span>
          <span className="font-mono text-emerald-400">{PROCESSING_TIME}</span>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-xl py-3.5 text-sm font-bold text-[#241608] transition-opacity hover:opacity-90"
        style={{ background: `linear-gradient(90deg, ${GOLD}, #d99a4e)` }}
      >
        Confirm Deposit
      </button>

      <p className="mt-3 text-center text-xs text-white/30">
        Secured by METALAN Multi-Signature Custody
      </p>
    </form>
  );
}

function DepositSuccess({ amount, onClose }) {
  const [copied, setCopied] = useState(false);
  const txHash = "0x7a3f...9c2d";

  function handleCopy() {
    navigator.clipboard?.writeText("0x7a3f000000000000000000000000000000000000000000000000000000009c2d");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-400/60 text-emerald-400">
        <CheckCircle2 size={30} />
      </div>

      <h2 className="mt-5 font-serif text-2xl text-white">Deposit Successful</h2>
      <p className="mt-1.5 text-sm text-white/40">
        Your transaction has been processed and credited
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-[#18211E] p-5">
        <p className="text-xs font-semibold tracking-wide" style={{ color: GOLD }}>
          AMOUNT DEPOSITED
        </p>
        <p className="mt-2 font-mono text-3xl font-bold text-white">{amount} FAIX</p>
        <p className="mt-1 text-sm text-white/40">Value: ~${amount} USD</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 text-left text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/40">Status</span>
          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-400 ring-1 ring-emerald-400/30">
            CONFIRMED
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-white/40">Transaction Hash</span>
          <button type="button" onClick={handleCopy} className="flex items-center gap-1.5 font-mono text-white">
            {txHash}
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-white/40" />}
          </button>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-white/40">Network</span>
          <span className="font-semibold text-white">Ethereum (ERC-20)</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-xl py-3.5 text-sm font-bold text-[#241608] transition-opacity hover:opacity-90"
        style={{ background: `linear-gradient(90deg, ${GOLD}, #d99a4e)` }}
      >
        Back to Wallet
      </button>
    </div>
  );
}
