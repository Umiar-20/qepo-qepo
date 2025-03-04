import { Button } from "~/components/ui/button";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";
import { supabase } from "~/lib/supabase/client";

export default function Home() {
  // for dark mode
  const { setTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("logout berhasil!");
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-background">
        <h1 className="text-3xl">Qepo cuy</h1>
        <Button>Klik Di mari</Button>
        <Button onClick={() => setTheme("dark")} size="icon">
          <Moon />
        </Button>
        <Button onClick={() => setTheme("light")} size="icon">
          <Sun />
        </Button>

        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </main>
    </>
  );
}
