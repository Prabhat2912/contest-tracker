"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ThemeToggle from "./themeBtn";
import { useTheme } from "next-themes";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { dark, neobrutalism } from "@clerk/themes";

const Header = () => {
  const { theme } = useTheme();

  const [clerkTheme, setClerkTheme] = useState(dark);

  useEffect(() => {
    if (theme === "dark") {
      setClerkTheme(dark);
    } else {
      setClerkTheme(neobrutalism);
    }
  }, [theme]);
  const { isSignedIn } = useUser();
  return (
    <header className='flex justify-center items-center p-2.5 bg-gray-100 shadow-md rounded-lg dark:bg-black dark:text-white text-black'>
      {theme == "dark" ? (
        <Image src='/logo2.png' width={50} height={50} alt='Logo' />
      ) : (
        <Image src='/logo.png' width={50} height={50} alt='Logo' />
      )}

      <div className='flex justify-between items-center w-full '>
        <h1 className=' font-semibold text-2xl'>Contest Tracker</h1>
        <div className='flex gap-2 items-center'>
          {isSignedIn ? (
            <UserButton
              appearance={{
                baseTheme: clerkTheme,
              }}
            />
          ) : (
            <Link href={"/sign-in"}>Login</Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
