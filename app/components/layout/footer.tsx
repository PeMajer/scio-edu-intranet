import { Logo } from "~/components/logo";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <Logo size="sm" variant="color" />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://scioedu.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              scioedu.cz
            </a>
            <span aria-hidden="true">|</span>
            <span>&copy; {new Date().getFullYear()} ScioPolis</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
