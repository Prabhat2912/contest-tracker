import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <div
      onClick={toggleTheme}
      className={cn(
        "p-3 rounded-md",
        theme === "dark"
          ? "dark:hover:bg-neutral-100 dark:hover:text-black"
          : "hover:bg-neutral-800 hover:text-white"
      )}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </div>
  );
}
