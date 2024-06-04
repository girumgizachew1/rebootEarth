'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Header() {
  const pathname = usePathname();

  return (
    <div className="h-16 bg-zinc-800 w-full p-4 text-zinc-100 flex gap-20 items-center ">
      <h1 className="text-lg font-medium">Reboot Earth</h1>
      <div className="flex gap-8 text-sm ">
        {['/', '/analytics', '/rotation'].map((path) => (
          <Link className={`pb-2 mx-2  "  ${
            pathname === path ? 'text-red-500 border-b-4 border-red-500' : ''
          }`}  href={path} key={path}>
            <span
              className={` ${
                pathname === path ? 'text-red-500 ' : ''
              }`}
            >
              {path === '/' ? 'Over View' : path.slice(1)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Header;
