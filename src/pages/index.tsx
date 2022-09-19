export default function Index() {
  return (
    <div className="w-screen h-screen grid place-items-center ">
      <div className="grid gap-3 text-center">
        <div className="flex items-center">
          <img src="/logo.svg" width="30" />
          <h1 className="text-3xl font-bold">Chess</h1>
        </div>
        <a
          href="/game"
          className="text-white border p-3 hover:bg-white hover:text-black"
        >
          Play Game
        </a>
        <a
          href="/fen"
          className="text-white border p-3 hover:bg-white hover:text-black"
        >
          FEN Analysis
        </a>
      </div>
    </div>
  );
}
