import { Form, Link, NavLink, useSubmit } from "@remix-run/react";
import { Menu, LogOut, User as UserIcon, Shield } from "lucide-react";
import { useState } from "react";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
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

function NavLinkItem({
  href,
  children,
  onClick,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  mobile?: boolean;
}) {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "transition-colors font-medium",
          mobile
            ? cn(
                "flex items-center px-3 py-2.5 rounded-lg text-base",
                isActive
                  ? "border-b-2 border-brand-primary text-brand-primary pb-0.5"
                  : "text-muted-foreground hover:text-brand-primary transition-colors text-sm font-medium"
              )
            : cn(
                "text-sm px-3 py-2",
                isActive
                  ? "border-b-2 border-brand-primary text-brand-primary pb-0.5"
                  : "text-muted-foreground hover:text-brand-primary transition-colors text-sm font-medium"
              )
        )
      }
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
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 ring-2 ring-brand-light hover:ring-brand-primary transition-all">
            {profile?.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={profile?.full_name ?? ""} />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{profile?.full_name ?? "Uživatel"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profile?.role === "admin" && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Administrace
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onSelect={() => submit(null, { method: "post", action: "/auth/logout" })}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Odhlásit se
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header({ user, profile }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
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
              <NavLinkItem key={item.href} href={item.href}>
                {item.label}
              </NavLinkItem>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <UserMenu user={user} profile={profile} />

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-4 pb-2">
                  <SheetTitle className="text-left">
                    <Logo size="sm" variant="color" />
                  </SheetTitle>
                </SheetHeader>
                <Separator />
                <nav className="flex flex-col gap-1 p-4">
                  {navItems.map((item) => (
                    <NavLinkItem
                      key={item.href}
                      href={item.href}
                      mobile
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </NavLinkItem>
                  ))}
                  {profile?.role === "admin" && (
                    <>
                      <Separator className="my-2" />
                      <NavLinkItem
                        href="/admin"
                        mobile
                        onClick={() => setMobileOpen(false)}
                      >
                        <Shield className="mr-2 h-4 w-4 inline" />
                        Administrace
                      </NavLinkItem>
                    </>
                  )}
                </nav>
                <div className="mt-auto p-4 border-t">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      {profile?.avatar_url && (
                        <AvatarImage src={profile.avatar_url} alt="" />
                      )}
                      <AvatarFallback className="text-xs">
                        {profile?.full_name?.charAt(0) ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {profile?.full_name ?? "Uživatel"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Form method="post" action="/auth/logout">
                    <Button variant="outline" size="sm" className="w-full" type="submit">
                      <LogOut className="mr-2 h-4 w-4" />
                      Odhlásit se
                    </Button>
                  </Form>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
