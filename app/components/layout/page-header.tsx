import { Link } from "@remix-run/react";
import { Badge } from "~/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { cn } from "~/lib/cn";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  /** URL obrázku pro hero banner. Pokud zadán, header se zobrazí jako vizuální banner. */
  imageUrl?: string;
  /** Full-bleed hero bez zaoblení, větší výška. */
  fullWidth?: boolean;
  /** Extra obsah vykreslený nad titulkem (např. pill badge). */
  preTitle?: React.ReactNode;
  /** Breadcrumb vykreslený uvnitř hero nad titulkem. */
  breadcrumb?: React.ReactNode;
  /** Badge pills zobrazené mezi breadcrumb a titulkem. */
  badges?: string[];
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  imageUrl,
  fullWidth,
  preTitle,
  breadcrumb,
  badges,
}: PageHeaderProps) {
  if (imageUrl) {
    return (
      <div className={cn("mb-8 space-y-3", className)}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <BreadcrumbNav items={breadcrumbs} />
        )}
        <div className={cn(
          "relative overflow-hidden",
          fullWidth
            ? "rounded-none min-h-[380px] w-screen relative left-1/2 -translate-x-1/2"
            : "rounded-2xl min-h-[260px]"
        )}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
          {fullWidth ? (
            <>
              <div
                className="absolute inset-0 md:hidden"
                style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--color-scioedu-primary) 85%, transparent) 0%, color-mix(in srgb, var(--color-scioedu-primary) 60%, transparent) 70%, color-mix(in srgb, var(--color-scioedu-primary) 30%, transparent) 100%)' }}
              />
              <div
                className="absolute inset-0 hidden md:block"
                style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--color-scioedu-primary) 75%, transparent), color-mix(in srgb, var(--color-scioedu-primary) 40%, transparent), transparent)' }}
              />
              <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
            </>
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-scioedu-primary) 80%, black) 0%, color-mix(in srgb, var(--color-scioedu-primary) 50%, transparent) 60%, transparent 100%)' }}
            />
          )}
          <div className={cn(
            "z-10 flex items-center",
            fullWidth
              ? "absolute inset-0 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10"
              : "relative h-full p-6 lg:p-8"
          )}>
            <div className="flex-1">
              {breadcrumb && (
                <div className="text-sm mb-4 flex items-center gap-1.5">
                  {breadcrumb}
                </div>
              )}
              {preTitle}
              <h1 className={cn(
                "font-[family-name:var(--font-poppins)] font-extrabold text-white tracking-tight",
                fullWidth ? "text-4xl md:text-5xl" : "text-4xl"
              )}>
                {title}
              </h1>
              {description && (
                <p className="text-white/85 text-[20px] font-[family-name:var(--font-roboto)] max-w-xl mt-1">{description}</p>
              )}
              {badges && badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {badges.map((badge) => (
                    <Badge key={badge} variant="brand-accent" size="md">{badge}</Badge>
                  ))}
                </div>
              )}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mb-8 space-y-3", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbNav items={breadcrumbs} />
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-lg text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <BreadcrumbItem key={item.label}>
              {isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={item.href!}>{item.label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
