import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t-2 border-(--ink)">
      <div className="mx-auto flex w-full max-w-[1160px] flex-wrap items-center justify-between gap-4 px-5 py-8">
        <Link href="#top" aria-label="PRAVEO" className="text-(--ink)">
          <Logo className="h-auto w-[110px]" />
        </Link>
        <p className="text-[13px]">
          More than food. It’s your vybe. • © 2026 PRAVEO
        </p>
      </div>
    </footer>
  );
}
