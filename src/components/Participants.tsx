
export default function Participants({users}:{users : string []}) {
  return (
    <div className="bg-white rounded-2xl p-5 row-span-6 col-span-3 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-500 mb-2">Participants</h2>
        {users.map((user,index) => (
            <div key={index} className="bg-blue-400 rounded-xl p-2 mb-2 text-white flex justify-between items-center    ">
                <p>{user}</p>
                <p className="border mr-2 rounded-full bg-green-400 w-3 h-3"></p>
            </div>
        ))}
    </div>
  )
}
