"use client";

import type { JSX } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletConnectButton(): JSX.Element {
  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => {
        const ready = mounted;
        const connected = ready && account && chain && !chain.unsupported;

        if (!connected) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className="btn-primary px-6 py-3 rounded-xl font-semibold"
            >
              Connect Wallet
            </button>
          );
        }

        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openChainModal}
              className="px-4 py-2 rounded-xl glass-card text-sm hover:bg-white/20 transition-colors"
            >
              {chain.hasIcon && chain.iconUrl ? (
                <span className="inline-flex items-center gap-2">
                  <Image
                    src={chain.iconUrl ?? ""}
                    alt={chain.name ?? "Chain"}
                    width={16}
                    height={16}
                    className="rounded-full"
                    unoptimized
                  />
                  {chain.name}
                </span>
              ) : (
                chain.name ?? "Change Network"
              )}
            </button>
            <button
              type="button"
              onClick={openAccountModal}
              className="btn-primary px-6 py-2 rounded-xl font-semibold"
            >
              {account.displayName}
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
