import { Mic, MicOff } from "lucide-react";
import { useState } from "react";
export default function Participants({
  users,
  username,
  allowTalk,
  handleAllowTalk,
}: {
  users: string[];
  username: string;
  allowTalk: Boolean;
  handleAllowTalk: () => void;
}) {
    const [searchTerm,setSearchTerm] = useState<string>("");
    const filteredUsers = users.filter(user => user.includes(searchTerm))

  return (
    <div className="bg-white rounded-2xl p-5 row-span-6 col-span-3 overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-500 mb-2">Participants</h2>
      <input onChange={(e) => setSearchTerm(e.target.value)} className="border-2 mb-2 w-full rounded-xl p-2 border-slate-400" type="text" name="user" id="user" placeholder="Type.."  />
      {filteredUsers.map((user, index) => (
        <div
          key={index}
          className="bg-slate-700 rounded-xl p-2 mb-2 text-white flex justify-between items-center    "
        >
          <p>{user}</p>
          <div className="flex items-center">
            {user === localStorage.getItem("username") ? (
              allowTalk ? (
                <>
                  {/* <p className="border mr-2 rounded-full bg-green-400 w-3 h-3 animate-ping"></p>
                   */}
                  <Mic onClick={handleAllowTalk} className="text-green-400 w-5" />
                </>
              ) : (
                <MicOff onClick={handleAllowTalk} className="text-red-300 w-5" />
              )
            ) : (
              <p className="border mr-2 rounded-full bg-green-400 w-2 h-2 animate-ping"></p>
            //   <p>{username}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
