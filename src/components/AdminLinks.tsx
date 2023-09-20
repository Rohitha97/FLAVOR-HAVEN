"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

const AdminLinks = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      {status === "authenticated" && session?.user.isAdmin ? (
        <div>
          <Link href="/settings">Settings</Link>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default AdminLinks;
