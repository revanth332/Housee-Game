
export default function Sidebar({randomNum,setRandomNumber}:{randomNum:number,setRandomNumber:() => void}) {
  return (
    <div className="flex justify-center items-center bg-white rounded-2xl">
        <div>
            <div className="text-center text-3xl mb-5">{randomNum}</div>
            <button className="p-2 bg-black rounded-xl w-[100px] text-white" onClick={setRandomNumber}>Click</button>
        </div>
    </div>
  )
}
