import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-black/60 text-sm text-white/70">
      <div className="container-lux flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Linkr. Crafted in Aotearoa.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/privacy" className="hover:text-gold">
            Privacy
          </Link>
          <Link href="/trust" className="hover:text-gold">
            Trust & Safety
          </Link>
          <Link href="/admin" className="hover:text-gold">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
