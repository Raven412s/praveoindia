import LogoPath from "./LogoPath";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1731 281"
      className={className}
      role="img"
      aria-label="PRAVEO"
    >
      <LogoPath />
    </svg>
  );
}
