import { prisma } from "@/lib/prisma";
import { KosCard } from "@/components/cards/KosCard";
import { FilterSidebar } from "@/components/forms/FilterSidebar";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SearchParams {
  kampus?: string;
  lokasi?: string;
  gender?: string;
  minHarga?: string;
  maxHarga?: string;
  page?: string;
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Record<string, any> = {};

  if (params.kampus) where.campus = params.kampus;
  if (params.lokasi) {
    where.address = {
      contains: params.lokasi,
      mode: "insensitive",
    };
  }
  if (params.gender) where.genderType = params.gender;
  if (params.minHarga || params.maxHarga) {
    where.price = {
      ...(params.minHarga ? { gte: parseInt(params.minHarga) } : {}),
      ...(params.maxHarga ? { lte: parseInt(params.maxHarga) } : {}),
    };
  }

  const page = params.page ? parseInt(params.page) : 1;
  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;
  const take = itemsPerPage;

  const [kosList, totalCount] = await Promise.all([
    prisma.kos.findMany({
      where,
      orderBy: [
        { ranking: { sort: "asc", nulls: "last" } },
        { createdAt: "desc" },
      ],
      skip,
      take,
      include: {
        images: { take: 1 }
      }
    }),
    prisma.kos.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const createPageHref = (pageNum: number) => {
    const query = new URLSearchParams();
    if (params.kampus) query.set("kampus", params.kampus);
    if (params.lokasi) query.set("lokasi", params.lokasi);
    if (params.gender) query.set("gender", params.gender);
    if (params.minHarga) query.set("minHarga", params.minHarga);
    if (params.maxHarga) query.set("maxHarga", params.maxHarga);
    query.set("page", pageNum.toString());
    return `/explore?${query.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Eksplor Kos</h1>
        <p className="text-muted-foreground mt-1">
          Menampilkan <span className="font-semibold text-foreground">{(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, totalCount)}</span> dari <span className="font-semibold text-foreground">{totalCount}</span> tempat kos
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <FilterSidebar currentParams={params} />
        </aside>

        {/* Kos Grid */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {kosList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {kosList.map((kos) => (
                  <KosCard key={kos.id} kos={kos} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <MapPin className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Tidak ada kos ditemukan</p>
                <p className="text-sm mt-1">Coba ubah filter pencarian Anda</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-border">
              {page > 1 ? (
                <Link href={createPageHref(page - 1)}>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl opacity-50 cursor-not-allowed" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}

              <div className="flex items-center gap-1.5">
                {getPageNumbers().map((p, idx) => (
                  typeof p === "number" ? (
                    <Link key={idx} href={createPageHref(p)}>
                      <Button
                        variant={p === page ? "default" : "outline"}
                        className={`h-9 w-9 rounded-xl text-sm font-medium ${
                          p === page ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {p}
                      </Button>
                    </Link>
                  ) : (
                    <span key={idx} className="px-2 text-muted-foreground text-sm font-semibold select-none">
                      {p}
                    </span>
                  )
                ))}
              </div>

              {page < totalPages ? (
                <Link href={createPageHref(page + 1)}>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl opacity-50 cursor-not-allowed" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

