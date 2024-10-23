
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
    <div className="bg-[#4a5b82] rounded-2xl flex justify-center items-center row-span-6 col-span-3">
      <div>
        <div className="text-center text-3xl mb-5">{randomNum}</div>
        {
          role === "host" && <button
          className="p-2 bg-gradient-to-br from-[#435275] to-[#4f618b] shadow-[5px_-5px_10px_#3f4d6f,-5px_5px_10px_#556996] rounded-xl w-[100px] text-white"
          onClick={setRandomNumber}
        >
          Click
          </button>
        }
      </div>
    </div>
  );
}
