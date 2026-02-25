import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, User, BarChart3, LogOut } from "lucide-react";
import { isAuthenticated, removeAuthToken } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import LanguageSwitcher from "@/components/language-switcher";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const authenticated = isAuthenticated();
  const { t } = useLanguage();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    enabled: authenticated,
    queryFn: async () => {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return null;
      const response = await fetch("/api/auth/me", {
        headers: headers as Record<string, string>,
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user;
    },
  });

  const handleLogout = () => {
    removeAuthToken();
    navigate("/");
    window.location.reload();
  };

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/k-ageseke", label: "Transfert" },
    { href: "/marketplace", label: t("nav.marketplace") },
    { href: "/services", label: t("nav.services") },
    { href: "/fonctionnement", label: t("nav.howItWorks") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <img
              width="150"
              src="/assets/logo_k-ageseke.png"
              alt="K-Ageseke Group"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-primary bg-primary/5 font-semibold"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons + Language */}
          <div className="hidden lg:flex items-center space-x-3">
            <LanguageSwitcher />
            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="max-w-[120px] truncate">{user?.firstName || t("nav.welcome")}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center space-x-2 w-full cursor-pointer">
                      <BarChart3 className="h-4 w-4" />
                      <span>{t("nav.dashboard")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center space-x-2 w-full cursor-pointer">
                      <User className="h-4 w-4" />
                      <span>{t("nav.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>{t("nav.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-primary hover:bg-primary/5 font-medium">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-medium shadow-sm">
                    {t("nav.register")}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-1 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive(link.href)
                          ? "text-primary bg-primary/5 font-semibold"
                          : "text-gray-700 hover:text-primary hover:bg-gray-50"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="flex justify-center py-4">
                    <LanguageSwitcher />
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    {authenticated ? (
                      <>
                        <p className="text-gray-700 font-medium px-4">
                          {t("nav.welcome")}, {user?.firstName}
                        </p>
                        <Link href="/dashboard" className="block" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full justify-start text-gray-700">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            {t("nav.dashboard")}
                          </Button>
                        </Link>
                        <Link href="/profile" className="block" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full justify-start text-gray-700">
                            <User className="h-4 w-4 mr-2" />
                            {t("nav.profile")}
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={() => { handleLogout(); setIsOpen(false); }}
                          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {t("nav.logout")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-white">
                            {t("nav.login")}
                          </Button>
                        </Link>
                        <Link href="/register" className="block" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                            {t("nav.register")}
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
