import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  MapPin, Ruler, Users, Star, Award, ArrowLeft, Wifi, Home
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function KosDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kos = await prisma.kos.findUnique({
    where: { slug },
    include: { facilities: { include: { facility: true } } },
  });

  if (!kos) notFound();

  const genderLabel: Record<string, string> = {
    PUTRA: "Putra", PUTRI: "Putri", CAMPUR: "Campur",
  };

  const roomFacilities = kos.facilities.filter((f) => f.facility.type === "ROOM");
  const publicFacilities = kos.facilities.filter((f) => f.facility.type === "PUBLIC");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery Placeholder */}
          <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center border border-border relative">
            <Home className="w-16 h-16 text-primary/20" />
            {kos.ranking && (
              <div className="absolute top-4 left-4 bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <Award className="w-4 h-4" />
                Ranking #{kos.ranking}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-2xl font-bold">{kos.name}</h1>
              <Badge variant="outline" className="whitespace-nowrap">
                {genderLabel[kos.genderType]}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                {kos.address}
              </span>
              <span className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-primary" />
                {kos.roomSize}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                Dekat {kos.campus}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{kos.description}</p>
          </div>

          {/* Facilities */}
          {roomFacilities.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold mb-3">Fasilitas Kamar</h2>
              <div className="flex flex-wrap gap-2">
                {roomFacilities.map((f) => (
                  <span key={f.id} className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-medium">
                    {f.facility.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {publicFacilities.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold mb-3">Fasilitas Umum</h2>
              <div className="flex flex-wrap gap-2">
                {publicFacilities.map((f) => (
                  <span key={f.id} className="text-sm bg-accent/10 text-teal-700 px-3 py-1.5 rounded-lg font-medium">
                    {f.facility.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Score Card */}
        <div className="space-y-4">
          {/* Price Card */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="text-2xl font-bold text-foreground mb-1">
              Rp {kos.price.toLocaleString("id-ID")}
            </div>
            <div className="text-sm text-muted-foreground mb-4">/bulan</div>
            <Button className="w-full rounded-xl" size="lg">
              Hubungi Pemilik
            </Button>
          </div>

          {/* SAW Score Card */}
          {kos.finalScore != null && (
            <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span className="font-semibold text-sm">Skor SAW</span>
              </div>
              <div className="text-4xl font-bold mb-1">
                {kos.finalScore.toFixed(4)}
              </div>
              <div className="text-blue-200 text-sm">
                Ranking #{kos.ranking} dari semua kos
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 text-xs text-blue-200">
                Dihitung menggunakan Simple Additive Weighting (SAW) berdasarkan 5 kriteria utama
              </div>
            </div>
          )}

          {/* Map Placeholder */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-sm mb-3">Lokasi</h3>
            <div className="h-36 bg-muted rounded-xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{kos.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
