export default function BookingBar() {
  return (
    <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-2 rounded-3xl md:rounded-full bg-white/90 px-4 md:px-2 py-4 md:py-2 shadow-lg w-[90%] sm:w-auto">
      <div className="flex flex-col px-3 md:px-5 py-1 border-b md:border-b-0 md:border-r border-stone-200">
        <span className="text-xs font-semibold text-stone-500">Check in</span>
        <input
          type="date"
          className="bg-transparent text-sm text-stone-800 outline-none cursor-pointer"
        />
      </div>
      <div className="flex flex-col px-3 md:px-5 py-1 border-b md:border-b-0 md:border-r border-stone-200">
        <span className="text-xs font-semibold text-stone-500">Check out</span>
        <input
          type="date"
          className="bg-transparent text-sm text-stone-800 outline-none cursor-pointer"
        />
      </div>
      <div className="flex flex-col px-3 md:px-5 py-1">
        <span className="text-xs font-semibold text-stone-500">Guests</span>
        <select className="bg-transparent text-sm text-stone-800 outline-none cursor-pointer">
          <option>1 guest</option>
          <option>2 guests</option>
          <option>3 guests</option>
          <option>4 guests</option>
          <option>5+ guests</option>
        </select>
      </div>
      <button className="md:ml-2 rounded-full bg-stone-800 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-700 transition-colors cursor-pointer">
        Search
      </button>
    </div>
  );
}
