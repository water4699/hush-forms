// Collaboration commit 10 by Bradley747 - 2025-11-08 16:19:00
"use client";

import { useMemo, useState, useEffect } from "react";
import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { useEncryptedSurvey } from "@/hooks/useEncryptedSurvey";
import { useWagmiEthersSigner } from "@/hooks/useWagmiEthersSigner";

export function EncryptedSurvey() {
  const { storage } = useInMemoryStorage();
  const { provider, chainId, signer, readonlyProvider, sameChain, sameSigner } = useWagmiEthersSigner();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLocalhost = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "0.0.0.0");

  const effectiveChainId = (() => {
    if (isLocalhost) {
      return chainId ?? 31337;
    }
    if (typeof chainId === "number" && chainId !== 31337) {
      return chainId;
    }
    return 11155111;
  })();

  const mockChains = isLocalhost ? { 31337: "http://localhost:8545" } : undefined;

  const { instance, status: fhevmStatus, error: fhevmError } = useFhevm({
    provider,
    chainId: effectiveChainId,
    enabled: true,
    initialMockChains: mockChains,
  });

  const survey = useEncryptedSurvey({
    instance,
    fhevmDecryptionSignatureStorage: storage,
    chainId: effectiveChainId,
    ethersSigner: signer,
    ethersReadonlyProvider: readonlyProvider,
    sameChain,
    sameSigner,
  });

  const canShowSummary = useMemo(() => survey.clearTallies, [survey.clearTallies]);
  
  // Input values for each question
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({
    0: "",
    1: "",
    2: "",
  });

  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {/* Header Section */}
      <div className="relative space-y-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-1.5 h-8 sm:h-10 bg-gradient-to-b from-violet-400/80 to-fuchsia-400/80 rounded-full shadow-[0_0_15px_rgba(167,139,250,0.5)]"></div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-rose-200 bg-clip-text text-transparent">
              Hush
            </span>
            <span className="text-white/90 ml-2 italic">Forms</span>
          </h1>
        </div>
        <p className="text-white/70 text-base sm:text-lg font-medium leading-relaxed max-w-2xl pl-1">
          The next generation of privacy-preserving surveys.
          Powered by Fully Homomorphic Encryption, your data remains yours—always.
        </p>
      </div>

      {/* FHEVM Status Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.08] via-transparent to-fuchsia-500/[0.08] rounded-3xl"></div>
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className={`status-indicator ${
                  fhevmStatus === "ready" ? "ready" :
                  fhevmStatus === "error" ? "error" :
                  ""
                }`}></div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Network Engine</div>
                <div className="text-xl font-bold text-white tracking-tight">FHEVM {fhevmStatus}</div>
              </div>
            </div>

            {isMounted && survey.contractAddress && (
              <div className="flex flex-col items-end gap-1 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Deployed Protocol</div>
                <div className="text-sm font-mono text-violet-300/80">{survey.contractAddress.slice(0, 6)}...{survey.contractAddress.slice(-4)}</div>
              </div>
            )}
          </div>

          {isMounted && (fhevmError || !survey.contractAddress) && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-sm">
              <p className="text-sm text-rose-200 font-medium">
                {fhevmError ? `System Interrupt: ${fhevmError.message}` : "Protocol offline: Please connect to the supported network."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        {survey.questions.map((q, index) => (
          <div
            key={q.questionId}
            className="group relative flex flex-col h-full rounded-[2.5rem] glass-card"
          >
            <div className="p-8 flex-1 space-y-8">
              {/* Question Header */}
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-gray-900 shadow-2xl ${
                  index === 0 ? "bg-gradient-to-br from-violet-200 to-fuchsia-300 shadow-violet-500/20" :
                  index === 1 ? "bg-gradient-to-br from-rose-200 to-orange-300 shadow-rose-500/20" :
                  "bg-gradient-to-br from-amber-200 to-emerald-300 shadow-emerald-500/20"
                }`}>
                  0{q.questionId + 1}
                </div>
                <h2 className="text-2xl font-bold text-white leading-tight tracking-tight h-14 line-clamp-2">{q.question}</h2>
              </div>
              
              {/* Input Control */}
              <div className="space-y-4">
                <div className="relative group/input">
                  <input
                    type="number"
                    value={inputValues[q.questionId] || ""}
                    onChange={(e) => setInputValues({ ...inputValues, [q.questionId]: e.target.value })}
                    placeholder="Enter value..."
                    className="form-input w-full px-6 py-5 rounded-[1.5rem] disabled:opacity-30"
                    disabled={!survey.canSubmit}
                  />
                </div>
                <button
                  onClick={() => {
                    const value = parseInt(inputValues[q.questionId] || "0", 10);
                    if (!isNaN(value) && value >= 0 && value <= 4294967295) {
                      survey.submit(q.questionId as 0 | 1 | 2, value);
                    }
                  }}
                  disabled={!survey.canSubmit || !inputValues[q.questionId]}
                  className={`btn-primary w-full py-5 rounded-[1.5rem] disabled:opacity-20 ${
                    index === 0 ? "shadow-violet-500/20" :
                    index === 1 ? "shadow-rose-500/20" :
                    "shadow-emerald-500/20"
                  }`}
                >
                  Encrypt & Submit
                </button>
              </div>

              {/* Data Preview */}
              <div className="pt-6 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Privacy Layer</span>
                  {q.handle && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]"></div>}
                </div>
                <div className="min-h-[4rem] px-4 py-3 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-center">
                  {q.handle ? (
                    <div className="text-[10px] font-mono text-violet-300/60 break-all text-center leading-relaxed">
                      {q.handle.slice(0, 120)}...
                    </div>
                  ) : (
                    <span className="text-xs text-white/20 font-medium italic tracking-wide">Awaiting encryption...</span>
                  )}
                </div>
              </div>

              {/* Verified Result */}
              {q.decrypted !== undefined && (
                <div className="mt-4 p-5 rounded-3xl bg-emerald-400/[0.03] border border-emerald-400/10 animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/50 mb-2 text-center">Plaintext Verified</div>
                  <div className="text-3xl font-black text-center text-emerald-300 tracking-tighter">
                    {String(q.decrypted ?? "-")}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Results Center */}
      <div className="glass-card rounded-[3rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/10 blur-[120px] rounded-full -ml-48 -mb-48"></div>
        
        <div className="relative p-10 md:p-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-4xl font-bold text-white tracking-tight">Decryption Center</h2>
              <p className="text-white/50 font-medium text-lg">Retrieve and verify your private responses locally.</p>
            </div>
            <button
              onClick={() => survey.decryptTallies()}
              disabled={!survey.canDecrypt}
              className="btn-primary px-10 py-6 rounded-3xl text-lg disabled:opacity-20 shadow-2xl"
            >
              Unlock Private Data
            </button>
          </div>
          
          {survey.message && (
            <div className="mb-12 p-6 rounded-3xl bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm flex items-center justify-center">
              <p className="text-violet-200 font-medium text-center">{survey.message}</p>
            </div>
          )}

          {canShowSummary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "ID Verification", value: survey.clearTallies?.idNumber, theme: "violet" },
                { label: "Secured Credential", value: survey.clearTallies?.bankPassword, theme: "rose" },
                { label: "Demographics", value: survey.clearTallies?.age, theme: "amber" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="glass-card rounded-[2rem] p-8"
                >
                  <div className="relative z-10 space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">{item.label}</div>
                    <div className={`text-5xl font-black tracking-tighter ${
                      item.theme === "violet" ? "text-violet-200" :
                      item.theme === "rose" ? "text-rose-200" :
                      "text-amber-200"
                    }`}>
                      {String(item.value ?? "•••")}
                    </div>
                  </div>
                  <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 rounded-full -mr-12 -mt-12 transition-all duration-700 group-hover:scale-150 ${
                    item.theme === "violet" ? "bg-violet-400" :
                    item.theme === "rose" ? "bg-rose-400" :
                    "bg-amber-400"
                  }`}></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
