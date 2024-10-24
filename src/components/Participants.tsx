import { Mic, MicOff } from "lucide-react";
import { useState } from "react";
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
    const filteredUsers = users.filter(user => user.username.includes(searchTerm))

  return (
    <div className="shadow-[3px_-3px_6px_#a1a1a1,-3px_3px_6px_#ffffff] bg-gradient-to-br from-[#f0f0f0] to-[#cacaca] rounded-2xl p-5 row-span-6 col-span-3 overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-500 mb-2">Participants</h2>
      <input onChange={(e) => setSearchTerm(e.target.value)} className="bg-gradient-to-br outline-none from-[#cacaca] to-[#f0f0f0] shadow-[3px_3px_6px_#bebebe,-3px_-3px_6px_#ffffff] mb-3 w-full rounded-xl p-2 border-slate-400" type="text" name="user" id="user" placeholder="Type.."  />
      {filteredUsers.map((user, index) => (
        <div
          key={index}
          className="shadow-[3px_-3px_6px_#a1a1a1,-3px_3px_6px_#ffffff] bg-gradient-to-br from-[#f0f0f0] to-[#cacaca] rounded-xl p-2 mb-2 text-slate-700 flex justify-between items-center"
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
