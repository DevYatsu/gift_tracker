"use client";

import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Switch
      defaultSelected={theme === "light"}
      size="lg"
      color="warning"
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
      onClick={() => {
        if (theme === "light") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      }}
    ></Switch>
  );
}
