import { Header } from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Videogrid from "@/components/Videogrid";

export default function Home() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="overflow-y-auto bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {/* Placeholder for video cards */}
          </div>
        </main>
      </div>
    </div>
  );
}