import { Form, Link, NavLink, useSubmit } from "@remix-run/react";
import { Menu, LogOut, Shield, X } from "lucide-react";
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
            <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-brand-light-hover hover:text-brand-primary focus:bg-brand-light-hover focus:text-brand-primary">
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
          className="rounded-xl px-3 py-2.5 cursor-pointer flex items-center gap-2.5 text-sm text-muted-foreground hover:bg-brand-light-hover hover:text-brand-primary focus:bg-brand-light-hover focus:text-brand-primary"
        >
          <LogOut size={16} />
          Odhlásit se
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu({ user, profile, open, onClose }: HeaderProps & { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      {/* Menu panel */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-out md:hidden flex flex-col",
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

export function Header({ user, profile }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <DesktopNavLink key={item.href} href={item.href}>
                  {item.label}
                </DesktopNavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <UserMenu user={user} profile={profile} />
              </div>

              {/* Mobile: avatar + hamburger */}
              <button
                className="md:hidden relative h-9 w-9 rounded-full"
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
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
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
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
