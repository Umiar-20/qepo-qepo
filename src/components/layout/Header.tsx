import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "../ui/button";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-border bg-transparent px-4 backdrop-blur-md md:h-20 md:px-8">
      <div>
        <Link
          href={"/"}
          className="text-2xl font-bold text-primary hover:cursor-pointer md:text-3xl"
        >
          Qepo
        </Link>
      </div>
      <nav className="flex items-center gap-6 font-semibold">
        <div>Courses</div>
        <div>Flash Sale</div>
        <div>About</div>
        {theme === "dark" ? (
          <Button
            onClick={() => setTheme("light")}
            size="icon"
            className="transition duration-200"
          >
            <Moon />
          </Button>
        ) : (
          <Button
            onClick={() => setTheme("dark")}
            size="icon"
            className="transition duration-200"
          >
            <Sun />
          </Button>
        )}
      </nav>
    </header>
  );
};
