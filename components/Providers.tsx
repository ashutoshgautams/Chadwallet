"use client";

import type { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { AuthProvider } from "./AuthProvider";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "clpispdty00ycl80fpueukbhl";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        // email is always available; google/apple require OAuth enabled in
        // Privy Dashboard → Authentication AND your domain added to
        // Basics → Clients → Allowed Origins.
        loginMethods: ["google", "email"],
        appearance: {
          theme: "dark",
          accentColor: "#26ED80",
          logo: "/brand/chad-mark-dark.png",
        },
        embeddedWallets: {
          solana: { createOnLogin: "users-without-wallets" },
        },
      }}
    >
      <AuthProvider>{children}</AuthProvider>
    </PrivyProvider>
  );
}
