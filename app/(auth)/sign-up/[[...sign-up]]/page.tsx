"use client";
import { SignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { dark, neobrutalism } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme } = useTheme();
  const [clerkTheme, setClerkTheme] = useState(dark);

  useEffect(() => {
    if (theme === "dark") {
      setClerkTheme(dark);
    } else {
      setClerkTheme(neobrutalism);
    }
  }, [theme]);
  return (
    <div className='  min-h-screen flex w-full justify-center items-center'>
      <SignUp
        signInUrl='/sign-in'
        appearance={{
          baseTheme: clerkTheme,
        }}
      />
    </div>
  );
}
