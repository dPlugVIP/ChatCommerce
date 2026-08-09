import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between", className)}>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">[ Command module ]</span>
        <h1 className="font-heading text-3xl font-black uppercase tracking-[-0.04em] md:text-5xl">{title}</h1>
        {description ? (
          <p className="max-w-2xl font-mono text-xs uppercase leading-6 tracking-[0.1em] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
