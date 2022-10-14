export default function Piece({ sprite }: { sprite: string | undefined }) {
  return sprite ? (
    <img
      className="z-[99] w-[90px] h-[full] absolute top-[50%] left-[50%]"
      style={{
        transform: "translate(-50%, -50%)",
      }}
      src={sprite}
      alt=""
    />
  ) : (
    <></>
  );
}
