import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "User dashboard", href: "/users-dashboard" },
    { label: "Department dashboard", href: "/department-dashboard" },
  ];
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">LOGO</span>
        </Link>

        <div className="flex gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted rounded-md"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          {!user ? (
            <div className="hidden gap-2 md:flex">
              <Link to="/login">
                <Button>Kirish</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Ro'yxatdan o'tish</Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/profile">
                <Button variant="outline">Profil</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden inline-flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container mx-auto max-w-7xl px-4 py-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link to="/login">
              <Button>Kirish</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
