"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useStateContext } from "@/providers/StateProvider";
import { useLogout, useMe } from "../../../../../hooks/auth/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const English = () => (
  <Image
    src="/images/flags/united-states.png"
    alt="US Flag"
    width={20}
    height={20}
  />
);

const German = () => (
  <Image src="/images/flags/germany.png" alt="BD Flag" width={20} height={20} />
);

const French = () => (
  <Image
    src={"/images/flags/france.png"}
    alt="FR Flag"
    width={20}
    height={20}
  />
);

const Turkish = () => (
  <Image
    src={"/images/flags/turkey.png"}
    alt="TR Flag"
    width={20}
    height={20}
  />
);

const Arabic = () => (
  <Image
    src={"/images/flags/arabic.png"}
    alt="Arabic Flag"
    width={20}
    height={20}
  />
);

const Spanish = () => (
  <Image src={"/images/flags/spain.png"} alt="ES Flag" width={20} height={20} />
);

const Albanian = () => (
  <Image
    src={"/images/flags/albania.png"}
    alt="AL Flag"
    width={20}
    height={20}
  />
);

const Portuguese = () => (
  <Image
    src={"/images/flags/portuges.png"}
    alt="PT Flag"
    width={20}
    height={20}
  />
);

export const languages = [
  { code: "EN", name: "English (US)", flag: <English /> },
  { code: "FR", name: "French", flag: <French /> },
  { code: "DE", name: "German", flag: <German /> },
  { code: "AR", name: "Arabic", flag: <Arabic /> },
  { code: "ES", name: "Spanish", flag: <Spanish /> },
  {
    code: "TR",
    name: "Turkish",
    flag: <Turkish />,
  },
  {
    code: "AL",
    name: "Albanian",
    flag: <Albanian />,
  },
  {
    code: "PT",
    name: "Portuguese",
    flag: <Portuguese />,
  },
];

const navConfig = [
  { label: "Home", href: "/" },
  { label: "Find a Dentist", href: "/find-dentist" },
  { label: "About us", href: "/about-us", hasDropdown: false },
  { label: "Guarantee", href: "/guarantee", hasDropdown: false },
];

export default function Navbar() {
  const {
    setShowSigninModal,
    setShowSignupModal,
    searchQuery,
    setSearchQuery,
  } = useStateContext();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ code: "EN", name: "English (US)", flag: <English /> });

  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const displayName = user?.name;

  const isShowGetStartedButton = pathname !== "/admin-login" && pathname !== "/register-doctor" && pathname !== "/register-patient" && pathname !== "/contact-us" && pathname !== "/"
  const isAuthenticated = !!user;

  return (
    <nav className="sticky shadow-md top-0 z-50 w-full border-b border-gray-100 bg-white py-6">
      <div className="mx-auto flex max-w-400 w-11/12 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <div className="flex items-center gap-1">
            <Image
              src={"/logos/mainlogo.png"}
              alt="Website logo"
              height={200}
              width={400}
              loading="eager"
              className="w-43 h-auto object-contain"
            />
          </div>
        </Link>

        {/* Navigation Links */}
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
              {item.hasDropdown && (
                <ChevronDown
                  size={16}
                  className="text-gray-400 group-hover:text-[#10436B] transition-colors"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Search Input */}
        <div className="hidden md:flex flex-1 max-w-md relative items-center">
          <input
            type="text"
            placeholder="Search by procedure and budget"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-4 pr-12 text-sm outline-none focus:border-[#10436B] transition-all"
          />
          <Search className="absolute right-4 text-gray-400" size={20} />
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            /* Logged In User Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#F2F5F6] hover:bg-[#E2E8F0] focus:outline-none transition-colors">
                <Avatar className="h-9 w-9 border border-gray-200">
                  <AvatarImage src="/avatar.jpg" />
                  <AvatarFallback className="bg-[#10436B] text-white font-semibold text-xs">
                    {user?.email ? user.email.slice(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-semibold text-gray-700 md:block max-w-[120px] truncate">
                  {displayName}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 space-y-2 p-4 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E] truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-[#6B7280] truncate">
                    {user?.email || ""}
                  </p>
                </div>
                <div className="border-b border-slate-100 my-2"></div>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 rounded-lg py-2" onClick={() => router.push(`/${user?.role.toLowerCase()}`)}>
                  My Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 rounded-lg py-2">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer flex items-center gap-2 hover:bg-red-50 rounded-lg py-2"
                  onClick={() => logout()}
                >
                  <LogOut size={16} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Logged Out Actions - Visible on All Routes */
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSigninModal(true)}
                className="text-[15px] font-semibold text-[#10436B] hover:text-[#0b2d49] transition-colors cursor-pointer"
              >
                Sign In
              </button>

              {isShowGetStartedButton ? (
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="rounded-full bg-[#10436B] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm cursor-pointer"
                >
                  Get Started
                </button>
              ) : <Link
                href="/register-doctor"
                className="hidden sm:block rounded-lg bg-[#10436B] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Join as a Doctor
              </Link>}

            </div>
          )}


          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors border border-transparent hover:border-gray-100">
              {selectedLang.flag}
              <span className="text-[15px] font-semibold text-gray-700">{selectedLang.code}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-white border border-gray-100 shadow-xl rounded-xl p-1.5 mt-1">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setSelectedLang(lang)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors focus:bg-gray-50 focus:outline-none",
                    selectedLang.code === lang.code && "bg-blue-50/50 text-[#10436B] font-semibold"
                  )}
                >
                  {lang.flag}
                  <span>{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                <Menu size={28} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 bg-white flex flex-col gap-6 overflow-y-auto border-l border-gray-100 shadow-xl">
              <SheetHeader className="p-0 border-b border-gray-100 pb-4">
                <SheetTitle className="text-left font-semibold text-lg text-[#10436B] flex items-center gap-2">
                  <Image
                    src={"/logos/mainlogo.png"}
                    alt="Website logo"
                    height={50}
                    width={100}
                    className="w-24 h-auto object-contain"
                  />
                </SheetTitle>
              </SheetHeader>

              {/* Navigation Links inside Sheet */}
              <div className="flex flex-col gap-4">
                <div className="relative md:hidden mb-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-4 pr-10 text-sm focus:border-[#10436B] outline-none transition-all"
                  />
                  <Search
                    className="absolute right-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>

                {navConfig.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "text-base font-semibold py-2.5 px-3 rounded-lg hover:bg-gray-50 hover:text-[#10436B] transition-all duration-200 flex items-center justify-between",
                      pathname === item.href
                        ? "text-[#10436B] bg-blue-50/50"
                        : "text-gray-700"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown size={16} className="text-gray-400" />}
                  </Link>
                ))}
              </div>

              <div className="mt-auto border-t border-gray-100 pt-6 flex flex-col gap-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Avatar className="h-10 w-10 border border-gray-200">
                        <AvatarImage src="/avatar.jpg" />
                        <AvatarFallback className="bg-[#10436B] text-white font-semibold text-sm">
                          {user?.email ? user.email.slice(0, 2).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#1A1A2E] truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-[#6B7280] truncate">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/patient"
                      className="flex items-center justify-center rounded-lg border border-gray-200 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => router.push(`/${user?.role.toLowerCase()}`)}
                    >
                      My Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout()
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-600 py-3 text-center font-semibold transition-colors hover:bg-red-100 cursor-pointer"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setShowSigninModal(true);
                      }}
                      className="w-full rounded-lg border border-gray-200 py-3 text-center font-semibold text-[#10436B] hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>

                    {isShowGetStartedButton ? (
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setShowSignupModal(true);
                        }}
                        className="w-full rounded-lg bg-[#10436B] py-3 text-center font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                      >
                        Get Started
                      </button>
                    ) : <Link
                      href="/register-doctor"
                      className="w-full rounded-lg bg-[#10436B] py-3 font-semibold text-white transition-opacity hover:opacity-90 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Join as a Doctor
                    </Link>
                    }

                    <>
                      <div className="border-t border-gray-100 pt-4 mt-2">
                        <p className="text-xs text-gray-400 font-semibold mb-2 uppercase">Select Language</p>
                        <div className="grid grid-cols-2 gap-2">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setSelectedLang(lang);
                                setIsOpen(false);
                              }}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer",
                                selectedLang.code === lang.code
                                  ? "border-[#10436B] bg-blue-50/30 text-[#10436B]"
                                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
                              )}
                            >
                              {lang.flag}
                              <span>{lang.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>

                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
