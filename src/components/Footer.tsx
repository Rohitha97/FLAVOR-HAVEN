import Link from "next/link";
import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="h-12 md:h-24 p-4 lg:px-20 xl:px-40 text-red-500 border-red-500 flex border-t-2 items-center justify-between">
      <div className="flex items-center gap-4">
        <Image src="/logo-re.png" alt="" width={50} height={100} />
        <Link href="/" className="font-bold text-xl">
          Flavor Haven
        </Link>
      </div>
      <p>© ALL RIGHTS RESERVED.</p>
    </div>
  );
};

export default Footer;
