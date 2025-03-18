"use client";
import { SignIn } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
    <div className='min-h-screen flex w-full justify-center items-center'>
      <SignIn
        signUpUrl='/sign-up'
        appearance={{
          baseTheme: clerkTheme,
        }}
      />
    </div>
  );
}
