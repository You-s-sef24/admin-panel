import { SunIcon } from "lucide-react";

export default function Header({ title }) {
  return (
    <header className="flex justify-between items-center bg-white shadow border-b-2">
      <div className="px-4 py-4">
        <h3 className="text-xl text-gray-900">{title}</h3>
      </div>
      <button className="p-2 me-6 hover:bg-gray-200 rounded-lg cursor-pointer">
        <SunIcon />
      </button>
    </header>
  );
}
