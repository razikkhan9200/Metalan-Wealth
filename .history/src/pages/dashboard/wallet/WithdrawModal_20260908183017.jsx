/* pages/dashboard/wallet/WithdrawModal.jsx: application source file. Withdraw Funds modal (form + success steps). */
import { useMemo, useState } from "react";

// lucide-react icons
import { ArrowUpRight, X, CheckCircle2, Copy, Check, ExternalLink } from "lucide-react";

// components Modal
import Modal from "../../../components/ui/Modal";

// constants
const GOLD = "#e8b46a";

// Sample in-app FAIX balance — same figure shown in the navbar/wallet
// summary, since this is withdrawing *from* the user's Metalan balance
// (unlike DepositModal's separate external-source balance).
const AVAILABLE_TO_WITHDRAW = "24,850.00";
const DESTINATION_ADDRESS_DISPLAY = "0x4B2c...8F1a";
const DESTINATION_ADDRESS_FULL = "0x4B2c0000000000000000000000000000000000000000000000000000008F1a";
const NETWORK_FEE = 1;
const ESTIMATED_TIME = "~15 minutes";

/**
 * Withdraw Funds modal.
 *
 * Two steps: `form` collects the amount + destination, then `success`
 * shows a submission receipt. `onClose` resets back to `form` so the
 * next open starts clean rather than resuming on the receipt.
 */
export default function WithdrawModal({ open, onClose }) {
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState("500.00");

  const youWillReceive = useMemo(() => {
    const parsed = parseFloat(amount.replace(/,/g, "")) || 0;
    return Math.max(parsed - NETWORK_FEE, 0).toFixed(2);
  }, [amount]);

  function handleClose() {
    onClose?.();
    setTimeout(() => setStep("form"), 200);
  }

  function handleConfirm(event) {
    event.preventDefault();
    // TODO(withdraw-api): submit { amount, destination, network } to
    // the withdrawal endpoint once it exists; this just advances to
    // the receipt step locally for now.
    setStep("success");
  }

  return (
    <Modal open={open} onClose={handleClose}>
      {step === "form" ? (
        <WithdrawForm
          amount={amount}
          onAmountChange={setAmount}
          youWillReceive={youWillReceive}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      ) : (
        <WithdrawSuccess amount={amount} onClose={handleClose} />
      )}
    </Modal>
  );
}

function WithdrawForm({ amount, onAmountChange, youWillReceive, onClose, onConfirm }) {
  return (
    <form onSubmit={onConfirm}>
      <div className="flex items-center justify-between pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${GOLD}1f`, color: GOLD }}>
            <ArrowUpRight size={16} />
          </span>
          <h2 className="font-serif text-2xl text-white">Withdraw Funds</h2>
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
            rather than a real dropdown — same reasoning as DepositModal. */}
        <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-6 rounded-full border-2" style={{ borderColor: GOLD }} />
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
          <p className="text-xs text-white/40">Available: {AVAILABLE_TO_WITHDRAW} FAIX</p>
        </div>
        <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent font-mono text-lg font-bold text-white outline-none"
          />
          <button
            type="button"
            onClick={() => onAmountChange(AVAILABLE_TO_WITHDRAW)}
            className="shrink-0 rounded-md border px-2.5 py-1 text-xs font-bold"
            style={{ borderColor: `${GOLD}99`, color: GOLD }}
          >
            MAX
          </button>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold tracking-wide text-white/40">DESTINATION WALLET ADDRESS</p>
        <input
          type="text"
          defaultValue={DESTINATION_ADDRESS_DISPLAY}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-sm text-white outline-none"
        />
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold tracking-wide text-white/40">SELECT NETWORK</p>
        <div
          className="mt-2 rounded-xl border py-3 text-center"
          style={{ borderColor: `${GOLD}66`, background: "#1A3C3455" }}
        >
          <p className="text-sm font-semibold" style={{ color: GOLD }}>Metalan Network</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Network Gas Fee</span>
          <span className="font-mono text-white">{NETWORK_FEE.toFixed(2)} FAIX (~${NETWORK_FEE.toFixed(2)})</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-white/40">Estimated Time</span>
          <span className="font-mono text-emerald-400">{ESTIMATED_TIME}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-sm font-semibold">
          <span style={{ color: GOLD }}>You will receive</span>
          <span className="font-mono" style={{ color: GOLD }}>{youWillReceive} FAIX</span>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-xl py-3.5 text-sm font-bold text-[#241608] transition-opacity hover:opacity-90"
        style={{ background: `linear-gradient(90deg, ${GOLD}, #d99a4e)` }}
      >
        Confirm Withdrawal
      </button>

      <p className="mt-3 text-center text-xs text-white/30">
        Secured by METALAN Multi-Signature Custody
      </p>
    </form>
  );
}

function WithdrawSuccess({ amount, onClose }) {
  const [copiedField, setCopiedField] = useState(null);
  const txHash = "0x9d4e...3a7b";

  function handleCopy(field, value) {
    navigator.clipboard?.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-400/60 text-emerald-400">
        <CheckCircle2 size={30} />
      </div>

      <h2 className="mt-5 font-serif text-2xl text-white">Withdrawal Submitted</h2>
      <p className="mt-1.5 text-sm text-white/40">
        Your request is being processed on the network.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <p className="text-xs font-semibold tracking-wide text-white/40">AMOUNT REQUESTED</p>
        <p className="mt-2 font-mono text-3xl font-bold" style={{ color: GOLD }}>
          {amount} FAIX
        </p>
        <p className="mt-1 text-sm text-white/40">~ ${amount} USD</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 text-left text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/40">Destination Address</span>
          <button
            type="button"
            onClick={() => handleCopy("address", DESTINATION_ADDRESS_FULL)}
            className="flex items-center gap-1.5 font-mono font-semibold text-white"
          >
            {DESTINATION_ADDRESS_DISPLAY}
            {copiedField === "address" ? (
              <Check size={13} className="text-emerald-400" />
            ) : (
              <Copy size={13} className="text-white/40" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-white/40">Network</span>
          <span className="font-semibold text-white">Ethereum (ERC-20)</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-white/40">Estimated Arrival</span>
          <span className="font-mono font-semibold text-emerald-400">{ESTIMATED_TIME}</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-white/40">Transaction Hash</span>
          <button
            type="button"
            onClick={() => handleCopy("hash", txHash)}
            className="flex items-center gap-1.5 font-mono font-semibold"
            style={{ color: GOLD }}
          >
            {txHash}
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-xl border py-3.5 text-sm font-bold transition-colors hover:bg-white/5"
        style={{ borderColor: `${GOLD}99`, color: GOLD }}
      >
        Back to Wallet
      </button>
    </div>
  );
}
