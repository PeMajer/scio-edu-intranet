import { Form, Link, NavLink, useSubmit } from "@remix-run/react";
import { Menu, LogOut, Shield, X, ChevronDown, GraduationCap, Sparkles, Users, Map, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/cn";

const educationMeta: Record<string, { title: string; href: string; icon: LucideIcon }> = {
  novacek: { title: "Jsem ve ScioPolis nováček", href: "/vzdelavani/novacek", icon: GraduationCap },
  rust: { title: "Vzdělávání a růst pro každého", href: "/vzdelavani/rust", icon: Sparkles },
  tymy: { title: "Rozvoj pro týmy a kvadriády", href: "/vzdelavani/tymy", icon: Users },
  cesty: { title: "Vzdělávací cesty", href: "/vzdelavani/cesty", icon: Map },
};

const educationOrder = ["novacek", "rust", "tymy", "cesty"];

interface HeaderProps {
  user: {
    id: string;
    email?: string;
  };
  profile: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  } | null;
  educationSections?: string[];
}

const navItems = [
  { label: "Dashboard", href: "/portal" },
  { label: "Vzdělávání", href: "/vzdelavani" },
  { label: "Moje kurzy", href: "/moje-kurzy" },
  { label: "Kalendář", href: "/kalendar" },
  { label: "Koncepce", href: "/koncepce" },
];

function DesktopNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "text-sm px-3 py-2 font-medium transition-colors border-b-2 pb-1",
          isActive
            ? "text-brand-primary"
            : "text-muted-foreground hover:text-brand-primary"
        )
      }
      style={({ isActive }) => ({ borderBottomColor: isActive ? 'var(--color-scioedu-accent)' : 'transparent' })}
    >
      {children}
    </NavLink>
  );
}

function DesktopEducationDropdown({ categories }: { categories: Array<{ key: string; title: string; href: string; icon: LucideIcon }> }) {
  return (
    <div className="relative group">
      <NavLink
        to="/vzdelavani"
        className={({ isActive }) =>
          cn(
            "text-sm px-3 py-2 font-medium transition-colors border-b-2 pb-1 flex items-center",
            isActive
              ? "text-brand-primary"
              : "text-muted-foreground hover:text-brand-primary"
          )
        }
        style={({ isActive }) => ({ borderBottomColor: isActive ? 'var(--color-scioedu-accent)' : 'transparent' })}
      >
        Vzdělávání
        <ChevronDown size={14} className="ml-1 transition-transform duration-200 group-hover:rotate-180" />
      </NavLink>

      <div className="absolute top-full left-0 pt-2 z-50 opacity-0 invisible translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out">
      <div className="bg-white rounded-2xl border border-border shadow-xl p-2 min-w-[320px]">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <NavLink
              key={category.key}
              to={category.href}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 py-2.5 text-sm transition-colors cursor-pointer px-3",
                  isActive
                    ? "bg-brand-light/20 text-brand-primary font-semibold before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:rounded-full before:bg-[var(--color-scioedu-accent)]"
                    : "rounded-xl text-foreground hover:bg-brand-light/40 hover:text-brand-primary font-medium"
                )
              }
            >
              <Icon size={16} className="text-brand-primary" />
              {category.title}
            </NavLink>
          );
        })}
        <div className="border-t border-border mt-1 pt-1">
          <Link
            to="/vzdelavani"
            className="px-3 py-2 text-xs text-brand-primary font-medium hover:text-brand-primary/80 flex items-center gap-1"
          >
            Všechny kategorie →
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "px-6 py-5 text-xl font-medium transition-colors",
          isActive
            ? "text-brand-primary border-l-4 bg-brand-light-hover pl-5"
            : "text-foreground hover:bg-brand-light-hover hover:text-brand-primary"
        )
      }
      style={({ isActive }) => isActive ? { borderLeftColor: 'var(--color-scioedu-accent)' } : undefined}
    >
      {children}
    </NavLink>
  );
}

function MobileEducationSection({
  categories,
  onClose,
}: {
  categories: Array<{ key: string; title: string; href: string; icon: LucideIcon }>;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-5">
        <NavLink
          to="/vzdelavani"
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "text-xl font-medium transition-colors",
              isActive
                ? "text-brand-primary"
                : "text-foreground hover:text-brand-primary"
            )
          }
        >
          Vzdělávání
        </NavLink>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown
            size={20}
            className={cn("transition-transform duration-200", expanded && "rotate-180")}
          />
        </button>
      </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          expanded ? "max-h-[300px]" : "max-h-0"
        )}
      >
        {categories.map((category) => (
          <NavLink
            key={category.key}
            to={category.href}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "block pl-10 pr-6 py-3 text-base transition-colors border-l-2 ml-6",
                isActive
                  ? "border-brand-primary text-brand-primary"
                  : "border-brand-light text-muted-foreground hover:text-brand-primary"
              )
            }
            style={({ isActive }) => isActive ? { borderLeftColor: 'var(--color-scioedu-accent)' } : undefined}
          >
            {category.title}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function UserMenu({ user, profile }: HeaderProps) {
  const submit = useSubmit();
  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-9 w-9 rounded-full cursor-pointer">
          <Avatar className="h-9 w-9 ring-2 ring-brand-light hover:ring-brand-primary transition-all">
            {profile?.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={profile?.full_name ?? ""} />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl border border-border shadow-xl p-2 min-w-[220px]">
        <div className="px-3 py-3 border-b border-border mb-1">
          <p className="font-semibold text-sm text-foreground">{profile?.full_name ?? "Uživatel"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
        </div>
        {profile?.role === "admin" && (
          <>
            <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-brand-light/40 hover:text-brand-primary focus:bg-brand-light/40 focus:text-brand-primary">
              <Link to="/admin" className="flex items-center gap-2.5 text-sm">
                <Shield className="text-brand-primary" size={16} />
                Administrace
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
          </>
        )}
        <DropdownMenuItem
          onSelect={() => submit(null, { method: "post", action: "/auth/logout" })}
          className="group/logout rounded-xl px-3 py-2.5 cursor-pointer flex items-center gap-2.5 text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut size={16} className="group-hover/logout:text-red-600 group-focus/logout:text-red-600" />
          Odhlásit se
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu({
  user,
  profile,
  educationSections,
  open,
  onClose,
}: HeaderProps & { open: boolean; onClose: () => void }) {
  const categories = educationSections?.length
    ? educationOrder.filter((k) => educationSections.includes(k)).map((k) => ({ key: k, ...educationMeta[k] }))
    : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity duration-300 nav:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      {/* Menu panel */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-out nav:hidden flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <Logo size="sm" variant="color" />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col mt-4 flex-1">
          {navItems.map((item) => (
            <MobileNavLink key={item.href} href={item.href} onClick={onClose}>
              {item.label}
            </MobileNavLink>
          ))}
          {profile?.role === "admin" && (
            <div className="border-t border-border mt-4 pt-4 mx-6">
              <NavLink
                to="/admin"
                onClick={onClose}
                className="flex items-center gap-2 py-3 text-sm text-muted-foreground hover:text-brand-primary transition-colors"
              >
                <Shield size={16} />
                Administrace
              </NavLink>
            </div>
          )}
        </nav>

        {/* Profile footer */}
        <div className="border-t border-border p-5 bg-white">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-brand-light">
              {profile?.avatar_url && (
                <AvatarImage src={profile.avatar_url} alt="" />
              )}
              <AvatarFallback className="text-xs">
                {profile?.full_name?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">
                {profile?.full_name ?? "Uživatel"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Form method="post" action="/auth/logout">
            <Button variant="outline" className="w-full mt-3" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Odhlásit se
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

export function Header({ user, profile, educationSections }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const categories = educationSections?.length
    ? educationOrder.filter((k) => educationSections.includes(k)).map((k) => ({ key: k, ...educationMeta[k] }))
    : [];

  return (
    <>
      <header className="border-b border-border shadow-sm bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/portal" className="shrink-0">
              <Logo size="sm" variant="color" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden nav:flex items-center gap-1">
              {navItems.map((item) =>
                item.label === "Vzdělávání" && categories.length > 0 ? (
                  <DesktopEducationDropdown key={item.href} categories={categories} />
                ) : (
                  <DesktopNavLink key={item.href} href={item.href}>
                    {item.label}
                  </DesktopNavLink>
                )
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <div className="hidden nav:block">
                <UserMenu user={user} profile={profile} />
              </div>

              {/* Mobile: avatar + hamburger */}
              <button
                className="nav:hidden relative h-9 w-9 rounded-full"
                onClick={() => setMobileOpen(true)}
              >
                <Avatar className="h-9 w-9 ring-2 ring-brand-light">
                  {profile?.avatar_url && (
                    <AvatarImage src={profile.avatar_url} alt="" />
                  )}
                  <AvatarFallback className="text-xs">
                    {profile?.full_name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </button>
              <button
                className="nav:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        user={user}
        profile={profile}
        educationSections={educationSections}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
