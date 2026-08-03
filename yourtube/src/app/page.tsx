import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Videogrid from "@/components/Videogrid";

export default function Home() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="overflow-y-auto bg-gray-50">
          <Videogrid />
        </main>
      </div>
    </div>
  );
}