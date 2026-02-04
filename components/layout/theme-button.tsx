"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

type ThemeButtonProps = {
  text?: boolean;
};

const ThemeButton = ({ text = false }: ThemeButtonProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (text) {
    return (
      <Button
        variant="ghost"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="flex items-center space-x-2"
      >
        <div>
          <span>
            {resolvedTheme === "light" && (
              <Moon size={18} className="text-primary" />
            )}
            {resolvedTheme === "dark" && (
              <Sun size={18} className="text-primary" />
            )}
          </span>
        </div>
        <span className="font-medium">
          {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
        </span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={"icon"}
      className="text-muted-foreground cursor-pointer"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "light" && <Moon className="size-6" />}
      {resolvedTheme === "dark" && <Sun className="size-6" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeButton;
