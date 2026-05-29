import { useRadio } from '../context/RadioContext';

export default function Header({ ciudades }) {
  const { searchQuery, setSearchQuery } = useRadio();

  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-zinc-800 sticky top-0 z-50 bg-black/90 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-bold text-lg">
          R
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-red-500">
          RADIOFLIX
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <input
          type="text"
          placeholder="Buscar emisora..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 outline-none w-40 md:w-64 text-sm text-white placeholder-zinc-500 focus:border-red-500 transition"
        />
        <button className="hidden md:block bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-xl font-semibold text-sm">
          Premium
        </button>
      </div>
    </header>
  );
}
