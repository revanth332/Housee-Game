import { Mic, MicOff } from "lucide-react";
import { useEffect, useState } from "react";
import { user } from "../App";
export default function Participants({
  users,
  username,
  allowTalk,
  handleAllowTalk,
}: {
  users: user[];
  username: string;
  allowTalk: Boolean;
  handleAllowTalk: () => void;
}) {
    const [searchTerm,setSearchTerm] = useState<string>("");
    const [orderedUsers,setOrderedUsers] = useState<user []>([])
    const filteredUsers = orderedUsers?.filter(user => user.username.includes(searchTerm))

    useEffect(() => {
        setOrderedUsers(() => {
          const currentUser = users?.find((user : user) => user.username === username);
          const otherUsers =  users?.filter((user : user) => user.username !== username);
          const newUsers =  currentUser ? [currentUser, ...otherUsers] : otherUsers;
          return newUsers;
        })
    },[users])

  return (
    <div className="bg-softColor shadow-softShadow md:rounded-2xl rounded-lg md:p-5 p-2 row-start-2 col-start-5 col-end-13 row-end-7 md:row-span-6 md:col-span-3 overflow-y-auto">
      <h2 className="text-xl pt-2 font-bold text-gray-500 mb-2">Participants</h2>
      <input onChange={(e) => setSearchTerm(e.target.value)} className="bg-softColor shadow-softShdowInner mb-3 w-full rounded-xl p-2 border-slate-400 outline-none" type="text" name="user" id="user" placeholder="Type.."  />
      {filteredUsers?.map((user, index) => (
        <div
          key={index}
          className="bg-softColor shadow-softShadow rounded-xl p-2 mb-2 text-slate-700 flex justify-between items-center"
        >
          <p>{user.username}</p>
          <div className="flex items-center">
            {user.username === username ? (
              allowTalk ? (
                <>
                  {/* <p className="border mr-2 rounded-full bg-green-400 w-3 h-3 animate-ping"></p>
                   */}
                  <Mic onClick={handleAllowTalk} className="text-green-600 w-5" />
                </>
              ) : (
                <MicOff onClick={handleAllowTalk} className="text-red-500 w-5" />
              )
            ) : (
              user.micAllowed ? <p className="border mr-2 rounded-full bg-green-600 w-2 h-2 animate-ping"></p> : <MicOff className="text-red-500 w-5" />
              // <p className="text-white">{username}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
