import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      className={cn(
        "p-3 rounded-md  ",
        theme === "dark"
          ? "dark:hover:bg-neutral-100 dark:hover:text-black"
          : "hover:bg-neutral-800 hover:text-white"
      )}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </div>
  );
}
