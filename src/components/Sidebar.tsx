
export default function Sidebar({
  randomNum,
  setRandomNumber,
  role,
  clicked
}: {
  randomNum: number;
  setRandomNumber: () => void;
  role: string;
  clicked:boolean;
}) {

  return (
    <div className="bg-softColor shadow-softShadow md:rounded-2xl rounded-lg flex justify-center items-center row-start-2 row-end-7 col-start-1 col-end-5 md:row-span-6 md:col-span-3">
      <div>
        <div className="text-center text-3xl mb-5 text-slate-700">{randomNum}</div>
        {
          role === "host" && <button
          className={`p-2 bg-softColor transition-shadow ease-in-out shadow-softShadow rounded-xl w-[100px] text-slate-700`}
          onClick={setRandomNumber}
        >
          {
          clicked ? "Stop" : "Start"
          }
          </button>
        }
      </div>
    </div>
  );
}
