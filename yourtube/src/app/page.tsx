import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Videogrid from "@/components/Videogrid";

export default function Home() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Videogrid />
        </main>
      </div>
    </div>
  );
}