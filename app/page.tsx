import { Sidebar } from "@/components/sidebar";
import { ScriptEditor } from "@/components/script-editor";

export default function Home() {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <ScriptEditor />
    </main>
  );
}