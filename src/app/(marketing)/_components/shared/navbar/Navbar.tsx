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
  { label: "Find a Dentist", href: "/find-dentist" },
  { label: "About us", href: "/about-us" },
];

export default function NavbarPublic() {
  const { setShowSigninModal, setShowSignupModal, searchQuery, setSearchQuery } =
    useStateContext();

  const pathname = usePathname();
  const { user } = useMe();
  console.log(user)
  const { mutate: logout } = useLogout();

  const isAuthenticated = !!user;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-md py-4 lg:py-6">
      <div className="mx-auto flex max-w-400 w-11/12 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
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

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex gap-8">
          {navConfig.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex gap-1 text-[15px] font-medium transition-colors",
                pathname === item.href
                  ? "text-[#10436B] border-b-2 border-[#10436B] pb-1"
                  : "text-gray-600 hover:text-[#10436B]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Search */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          variant="desktop"
        />

        {/* Desktop Actions */}
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

        {/* Mobile Menu */}
        <MobileMenu
          navConfig={navConfig}
          pathname={pathname}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          user={user}
          onSignInClick={() => setShowSigninModal(true)}
          onSignUpClick={() => setShowSignupModal(true)}
          onLogout={() => logout()}
        />
      </div>
    </nav>
  );
}