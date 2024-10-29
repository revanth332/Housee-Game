
export default function Sidebar({
  randomNum,
  setRandomNumber,
  role,
  clicked,
  handleClick,
  counter
}: {
  randomNum: number;
  setRandomNumber: () => void;
  role: string;
  clicked:boolean;
  handleClick : () => void,
  counter : number
}) {

  return (
    <div className="bg-softColor shadow-softShadow md:rounded-2xl rounded-lg grid grid-rows-6 row-start-2 row-end-7 col-start-1 col-end-5 md:row-span-6 md:col-span-3">
      <div className="row-span-5 flex flex-col justify-center items-center">
        <div className="text-center text-6xl mb-5 text-slate-700">{randomNum}</div>
        {
          role === "host" && (
          clicked ? <button
          className={`p-2 bg-red-500 transition-shadow ease-in-out shadow-softShadow rounded-xl w-[100px] text-white`}
          onClick={handleClick}
        >
          Stop
          </button>
          :
          <button
          className={`p-2 bg-softColor transition-shadow ease-in-out shadow-softShadow rounded-xl w-[100px] text-slate-700`}
          onClick={setRandomNumber}
        >
          Start
          </button>
        )}
      </div>

      <div className="row-span-1 grid md:grid-cols-6 justify-center  items-center">
        <div className="md:col-start-6 w-10 h-10 rounded-full flex justify-center items-center bg-gradient-to-br from-blue-400 to-red-400">
          <div className="bg-white rounded-full w-6 h-6 flex justify-center items-center">
            {counter}
          </div>
        </div>
      </div>
    </div>
  );
}
