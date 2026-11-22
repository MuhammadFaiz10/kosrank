import { prisma } from "@/lib/prisma";
import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const forgotSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email tidak valid."),
});

export async function POST(req: Request) {
  try {
    const parsed = forgotSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const email = parsed.data.email;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Token acak disimpan sebagai hash SHA-256; URL reset dikirim via email
      // di produksi. Tanpa SMTP, URL di-log ke console server (mode dev).
      const token = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(token).digest("hex");

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: tokenHash,
          resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      console.log(`[forgot-password] URL reset untuk ${email}: /auth/reset-password?token=${token}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Terjadi kesalahan." },
      { status: 500 }
    );
  }
}
