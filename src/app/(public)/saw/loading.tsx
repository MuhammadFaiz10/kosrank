export default function SawLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      <div className="h-4 w-48 bg-surface-muted rounded-lg animate-pulse mb-4" />
      <div className="h-8 w-72 bg-surface-muted rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-full max-w-2xl bg-surface-muted rounded-lg animate-pulse mb-8" />

      {[1, 2, 3].map((s) => (
        <div key={s} className="mb-8" aria-hidden="true">
          <div className="h-5 w-56 bg-surface-muted rounded-lg animate-pulse mb-3" />
          <div className="bg-white border border-line rounded-2xl p-4 space-y-2.5">
            {[1, 2, 3, 4, 5].map((r) => (
              <div key={r} className="h-4 w-full bg-surface-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      ))}

      <span className="sr-only">Memuat perhitungan SAW...</span>
    </div>
  );
}
