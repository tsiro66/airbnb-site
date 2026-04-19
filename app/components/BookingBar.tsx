export default function BookingBar() {
  return (
    <div className="mt-4 md:mt-8 flex flex-col md:flex-row items-stretch md:items-center gap-2 rounded-2xl md:rounded-full bg-white/90 px-3 md:px-2 py-2.5 md:py-2 shadow-lg w-[90%] sm:w-auto">
      <div className="flex flex-col px-3 md:px-5 py-0.5 border-b md:border-b-0 md:border-r border-stone-200">
        <span className="text-[10px] md:text-xs font-semibold text-stone-500">Check in</span>
        <input
          type="date"
          className="bg-transparent text-xs md:text-sm text-stone-800 outline-none cursor-pointer"
        />
      </div>
      <div className="flex flex-col px-3 md:px-5 py-0.5 border-b md:border-b-0 md:border-r border-stone-200">
        <span className="text-[10px] md:text-xs font-semibold text-stone-500">Check out</span>
        <input
          type="date"
          className="bg-transparent text-xs md:text-sm text-stone-800 outline-none cursor-pointer"
        />
      </div>
      <div className="flex flex-col px-3 md:px-5 py-0.5">
        <span className="text-[10px] md:text-xs font-semibold text-stone-500">Guests</span>
        <select className="bg-transparent text-xs md:text-sm text-stone-800 outline-none cursor-pointer">
          <option>1 guest</option>
          <option>2 guests</option>
          <option>3 guests</option>
          <option>4 guests</option>
          <option>5+ guests</option>
        </select>
      </div>
      <button className="md:ml-2 rounded-full bg-stone-800 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-stone-700 transition-colors cursor-pointer">
        Search
      </button>
    </div>
  );
}
