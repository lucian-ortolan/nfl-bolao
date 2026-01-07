"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded border-2 border-red-600 px-3 py-1 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold uppercase tracking-wide"
    >
      Sair
    </button>
  );
}
