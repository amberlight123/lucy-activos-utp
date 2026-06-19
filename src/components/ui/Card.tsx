export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`app-card ${className}`}>{children}</section>;
}

export function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-border px-5 py-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
