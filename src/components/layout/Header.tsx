import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white bg-opacity-80 px-4 backdrop-blur-md dark:bg-gray-900 dark:bg-opacity-80 md:h-20 md:px-8">
      {/* Logo */}
      <div>
        <Link
          href="/"
          className="text-2xl font-bold text-primary hover:cursor-pointer md:text-3xl"
        >
          Qepo
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-6 font-semibold md:flex">
        <Link href="/courses" className="hover:text-primary">
          Courses
        </Link>
        <Link href="/flash-sale" className="hover:text-primary">
          Flash Sale
        </Link>
        <Link href="/about" className="hover:text-primary">
          About
        </Link>
      </nav>

      {/* Right side: Theme Toggle + Mobile Menu Button */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle (Always Visible) */}
        {mounted && (
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            size="icon"
            className="transition duration-200"
          >
            {theme === "dark" ? <Moon /> : <Sun />}
          </Button>
        )}

        {/* Mobile Menu Button */}
        <Button
          onClick={() => setMenuOpen(!menuOpen)}
          size="icon"
          className="md:hidden"
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <nav className="absolute left-0 top-16 w-full bg-white p-6 shadow-lg dark:bg-gray-900 md:hidden">
          <ul className="flex flex-col items-center gap-4 font-semibold">
            <Link
              href="/courses"
              className="w-full text-center hover:text-primary"
            >
              Courses
            </Link>
            <Link
              href="/flash-sale"
              className="w-full text-center hover:text-primary"
            >
              Flash Sale
            </Link>
            <Link
              href="/about"
              className="w-full text-center hover:text-primary"
            >
              About
            </Link>
          </ul>
        </nav>
      )}
    </header>
  );
};
