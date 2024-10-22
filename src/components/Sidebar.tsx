
export default function Sidebar({
  randomNum,
  setRandomNumber,
  role,
}: {
  randomNum: number;
  setRandomNumber: () => void;
  role: string;
}) {
  return (
    <div className="bg-white rounded-2xl flex justify-center items-center row-span-6 col-span-3">
      <div>
        <div className="text-center text-3xl mb-5">{randomNum}</div>
        {
          role === "host" && <button
          className="p-2 bg-black rounded-xl w-[100px] text-white"
          onClick={setRandomNumber}
        >
          Click
          </button>
        }
      </div>
    </div>
  );
}
