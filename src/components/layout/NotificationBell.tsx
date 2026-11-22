"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";

export function NotificationBell() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);

  const role = (session?.user as { role?: string })?.role;
  const href = role === "ADMIN" ? "/admin/bookings" : "/dashboard";

  useEffect(() => {
    if (!session?.user) return;

    let active = true;
    fetch("/api/notifikasi/unread")
      .then((res) => res.json())
      .then((data) => {
        if (active && typeof data.count === "number") setCount(data.count);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [session]);

  if (!session?.user) return null;

  return (
    <Link
      href={href}
      aria-label={`Notifikasi${count > 0 ? ` (${count} belum dibaca)` : ""}`}
      className="relative p-1.5 rounded-full hover:bg-white/15 transition-colors text-white"
    >
      <Bell className="w-4 h-4" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-eco text-white text-[9px] font-bold min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-0.5 border-2 border-brand-700">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
