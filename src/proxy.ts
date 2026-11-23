import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl
  const role = (req.auth?.user as any)?.role

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/login?from=admin", req.url))
    }
  }

  // Panel seller sudah dilebur ke /admin — arahkan pengunjung lama
  if (pathname.startsWith("/seller")) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  // Modul SPK varian dengan auth (semua role yang sudah login)
  if (pathname.startsWith("/app")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/auth/login?from=app", req.url))
    }
  }

  // User/Customer dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/seller/:path*", "/dashboard/:path*", "/app/:path*"],
}
