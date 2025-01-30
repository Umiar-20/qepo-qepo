import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <h1 className="text-3xl">Qepo cuy</h1>
        <Button>Klik Di mari</Button>
      </main>
    </>
  );
}
