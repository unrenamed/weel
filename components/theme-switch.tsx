"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "./icons";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      aria-label="Toggle theme"
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-800"
      onClick={() =>
        setTheme(
          theme === "dark" || resolvedTheme === "dark" ? "light" : "dark"
        )
      }
    >
      {mounted && (theme === "dark" || resolvedTheme === "dark") ? (
        <Moon className="h-4 w-4 text-gray-900 dark:text-gray-100" />
      ) : (
        <Sun className="h-4 w-4 text-gray-900 dark:text-gray-100" />
      )}
    </button>
  );
};

export default ThemeSwitch;
