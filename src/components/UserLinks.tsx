"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const UserLinks = () => {
  const { status } = useSession();
  const [activeLink, setActiveLink] = useState("/");

  return (
    <div>
      {status === "authenticated" ? (
        <div>
          <Link href="/orders">
            <div
              onClick={() => setActiveLink("/orders")}
              className={`border-2 ${activeLink === "/orders" ? "border-red-500" : "border-transparent"} hover:border-red-500 rounded-md p-2 focus:outline-none`}
            >
              Orders
            </div>
          </Link>
          <span className="ml-4 cursor-pointer hover:border-red-500 rounded-md p-2 focus:outline-none" onClick={() => signOut()}>
            Logout
          </span>
        </div>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </div>
  );
};

export default UserLinks;
