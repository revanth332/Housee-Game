
export default function Tile({number}:{number:() => number}) {
  return (
    <div className="bg-slate-300 p-5 w-[100px] border-white border-2 text-center">{number()}</div>
  )
}
