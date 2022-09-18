export default function PlayerBanner({ name }: { name: string }) {
  return (
    <div
      className={`my-5 w-[600px] block p-6 bg-black rounded-lg shadow-md flex items-center justify-between`}
    >
      <div className="flex items-center gap-5">
        <div className="w-[50px] h-[50px] object-cover rounded-full">
          <img
            src="https://source.unsplash.com/100x100"
            className="rounded-full w-full h-full object-cover"
            alt={name}
          />
        </div>
        <div>
          <h1 className="text-xl font-bold">{name}</h1>
          <p>Capture Opponent's Pieces to View Them Here</p>
        </div>
      </div>
      <div className="bg-neutral-700 px-4 py-2 rounded font-bold">
        ⌛ 8 : 12
      </div>
    </div>
  );
}
