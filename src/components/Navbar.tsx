"use client";
import React, { useState } from "react";
import Menu from "./Menu";
import Link from "next/link";
import CartIcon from "./CartIcon";
import { signOut, useSession } from "next-auth/react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  activeLink: string;
  setActiveLink: (href: string) => void;
}

const NavLink = ({ href, children, activeLink, setActiveLink }: NavLinkProps) => {
  return (
    <Link href={href}>
      <div onClick={() => setActiveLink(href)} className={`border-2 ${activeLink === href ? "border-red-500" : "border-transparent"} hover:border-red-500 rounded-md p-2 focus:outline-none`}>
        {children}
      </div>
    </Link>
  );
};

const Navbar = () => {
  const { data: session, status } = useSession();
  const [activeLink, setActiveLink] = useState("/");

  return (
    <div className="h-12 text-red-500 p-4 flex items-center justify-between border-b-2 border-b-red-500 uppercase md:h-24 lg:px-20 xl:px-40">
      <div className="hidden md:flex gap-4 flex-1">
        <NavLink href="/" activeLink={activeLink} setActiveLink={setActiveLink}>
          Homepage
        </NavLink>
        <NavLink href="/menu" activeLink={activeLink} setActiveLink={setActiveLink}>
          Menu
        </NavLink>
        <NavLink href="/contact" activeLink={activeLink} setActiveLink={setActiveLink}>
          Contact
        </NavLink>
      </div>
      <div className="text-xl md:font-bold flex-1 md:text-center">
        <Link href="/">Flavor Haven</Link>
      </div>
      <div className="md:hidden">
        <Menu />
      </div>
      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
        <CartIcon />
        {status === "authenticated" && session?.user.isAdmin && (
          <NavLink href="/settings" activeLink={activeLink} setActiveLink={setActiveLink}>
            Settings
          </NavLink>
        )}
        {status === "authenticated" ? (
          <>
            <NavLink href="/orders" activeLink={activeLink} setActiveLink={setActiveLink}>
              Orders
            </NavLink>
            <span className="ml-4 cursor-pointer hover:border-red-500 rounded-md p-2 focus:outline-none" onClick={() => signOut()}>
              Logout
            </span>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
