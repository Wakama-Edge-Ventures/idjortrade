import Link from "next/link";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  badge?: string;
  href: string;
}

export default function ToolCard({
  title,
  description,
  icon,
  accentColor,
  badge,
  href,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className="card card-hover relative flex flex-col gap-4 p-5 overflow-hidden"
    >
      {/* Glow blob */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
        style={{ background: accentColor, opacity: 0.08 }}
      />

      {/* Badge */}
      {badge && (
        <span
          className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: `${accentColor}22`,
            color: accentColor,
            border: `1px solid ${accentColor}44`,
          }}
        >
          {badge}
        </span>
      )}

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accentColor}18`, color: accentColor }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="font-display font-semibold text-base" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      </div>

      {/* CTA */}
      <p className="text-sm font-semibold mt-auto" style={{ color: accentColor }}>
        Lancer →
      </p>
    </Link>
  );
}
