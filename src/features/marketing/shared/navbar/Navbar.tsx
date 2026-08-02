"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useStateContext } from "@/providers/StateProvider";
import { useLogout, useMe } from "@/hooks/auth/useAuth";
import SearchInput from "./Navbar/SearchInput";
import UserMenu from "./Navbar/UserMenu";
import AuthButtons from "./Navbar/AuthButtons";
import LanguageSelector from "./Navbar/LanguageSelector";
import MobileMenu from "./Navbar/MobileMenu";

const navConfig = [
  { label: "Home", href: "/" },
  { label: "Find a Dentist", href: "/find-dentists" },
  { label: "About us", href: "/about-us" },
  {
    label: "Contact Us", href: "/contact"
  },
  {
    label: "Blogs", href: "/blog"
  }
];

export default function NavbarPublic() {
  const { setShowSigninModal, setShowSignupModal, searchQuery, setSearchQuery } =
    useStateContext();

  const pathname = usePathname();
  const { user } = useMe();
  const { mutate: logout } = useLogout();

  const isAuthenticated = !!user;

  const handleNavClick = (targetPath: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const normalize = (path: string) =>
      path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

    if (normalize(pathname) === normalize(targetPath)) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow/5 py-4 lg:py-6">
      <div className="mx-auto flex max-w-400 w-11/12 items-center justify-between gap-4">

        <Link
          href="/"
          onClick={handleNavClick("/")}
          className="flex shrink-0 items-center"
        >
          <Image
            src="/logos/mainlogo.png"
            alt="Website logo"
            height={200}
            width={400}
            loading="eager"
            className="w-40 h-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden lg:flex gap-8">
          {navConfig.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleNavClick(item.href)}
              className={cn(
                "group flex gap-1 text-[15px] font-medium transition-colors",
                pathname === item.href
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-gray-600 hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          variant="desktop"
        />

        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <UserMenu user={user!} onLogout={() => logout()} />
          ) : (
            <AuthButtons
              onSignInClick={() => setShowSigninModal(true)}
              onSignUpClick={() => setShowSignupModal(true)}
            />
          )}

          <LanguageSelector />
        </div>

        {/* ✅ Mobile Menu: Passing the handler so you can use it inside MobileMenu.tsx as well */}
        <MobileMenu
          navConfig={navConfig}
          pathname={pathname}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          user={user}
          onSignInClick={() => setShowSigninModal(true)}
          onSignUpClick={() => setShowSignupModal(true)}
          onLogout={() => logout()}
          onNavClick={handleNavClick}
        />
      </div>
    </nav>
  );
}