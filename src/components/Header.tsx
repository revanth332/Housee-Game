
export default function Header({logout}:{logout : () => void}) {
  return (
    <div className="px-5 row-span-1 col-span-9 bg-white rounded-xl flex justify-between  items-center">
        <h1 className="font-bold text-black text-2xl">Housie</h1>
        <div><span className="mr-3 text-blue-500 font-medium">{localStorage.getItem("roomNo")}</span><span className="mr-3 text-blue-500 font-medium">{localStorage.getItem("username")}</span> <button onClick={logout} className="text-red-500 font-medium">Exit</button> </div>
    </div>
  )
}
