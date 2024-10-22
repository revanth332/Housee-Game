import { useEffect, useState } from "react";
import Board from "./components/Board";
import Sidebar from "./components/Sidebar";
import { socket } from "./components/Socket";
import { toast } from "react-toastify";
import { useRef } from "react";
import axios from "axios";
import Participants from "./components/Participants";
import Header from "./components/Header";

export const randomNumberInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

type tile = {
  number:number,
  marked:boolean
}

function App() {
  const [randomNum, setRandomNum] = useState(0);
  const [genNums, setgenNums] = useState<number[]>([]);
  const [store, setStore] = useState<number[]>([]);
  const [count, setCount] = useState(-1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [role, setRole] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [roomNo, setRoomNo] = useState<string>("");
  const [totalTiles,setTotalTiles] = useState<tile []>([])
  const [users,setUsers] = useState<string []>([])
  const [logged,setLogged] = useState(false);
  const [username,setUsername] = useState("");

  const logout = () => {
    localStorage.clear();
    dialogRef.current?.showModal();
    setLogged(false);
    setRandomNum(0);
    setgenNums([])
    setStore([])
    setCount(-1)
    setRole("")
    setRoomNo("")
    setTotalTiles([])
    setUsers([])
    setUsername("")
  }

  const setRandomNumber = () => {
    setCount((prev) => {
      const next = prev + 1;

      localStorage.setItem("randomNum", store[next].toString());
      localStorage.setItem(
        "genNums",
        JSON.stringify([...genNums, store[next]])
      );
      localStorage.setItem("count",next.toString());

      setRandomNum(store[next]);
      setgenNums([...genNums,store[next]]);
      socket.emit("housie", store[next], role, roomNo,[...genNums,store[next]]);
      return next;
    });
  };

  useEffect(() => {
    socket.connect();
    console.log("called",role);

    socket.emit("entered",role,roomNo,username);

    socket.on("entered",(role,room,username) => {
      if(role === "guest" && room === roomNo){
        console.log(users,username)
        setUsers([username,...users]);
      }
      
    })

    socket.on('connect', () => {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
            var madiaRecorder = new MediaRecorder(stream);
            var audioChunks :  Blob[] = [];

    
            madiaRecorder.addEventListener("dataavailable", function (event) {
                audioChunks.push(event.data);
            });
    
            madiaRecorder.addEventListener("stop", function () {
                var audioBlob = new Blob(audioChunks);
                audioChunks = [];
                var fileReader = new FileReader();
                fileReader.readAsDataURL(audioBlob);
                fileReader.onloadend = function () {
                    var base64String = fileReader.result;
                    socket.emit("audioStream", base64String);
                };
    
                madiaRecorder.start();
                setTimeout(function () {
                    madiaRecorder.stop();
                }, 1000);
            });
    
            madiaRecorder.start();
            setTimeout(function () {
                madiaRecorder.stop();
            }, 1000);
        })
        .catch((error) => {
            console.error('Error capturing audio.', error);
        });
    });
    
    socket.on('audioStream', (audioData) => {
        var newData = audioData.split(";");
        newData[0] = "data:audio/ogg;";
        newData = newData[0] + newData[1];
    
        var audio = new Audio(newData);
        if (!audio || document.hidden) {
            return;
        }
        audio.play();
    });

    socket.on("housie", (number: number, srole: string, roomNo: string,genNums : number[],users : string[]) => {
      // console.log(role,srole);
      if (role === "guest" && roomNo === roomNo) {
        // localStorage.setItem("randomNum",number.toString())
        setCount((prev) => {
          const next = prev + 1;
          console.log([...genNums, number],randomNum,count)
          localStorage.setItem("randomNum", number.toString());
          localStorage.setItem(
            "genNums",
            JSON.stringify([...genNums,number ])
          );
          localStorage.setItem("count",next.toString());
          localStorage.setItem("users",JSON.stringify(users))
          setUsers(users)
          setRandomNum(number);
          setgenNums([...genNums, number]);
          return next;
        });
        toast(`Number drawn: ${number}`);
      }
    });

    return () => {
      socket.off("housie");
      socket.disconnect();
    };
  }, [role,roomNo,username]);
  

  useEffect(() => {
    const role = localStorage.getItem("role");
    const roomNo = localStorage.getItem("roomNo");
    const genNums = localStorage.getItem("genNums");
    const randomNum = localStorage.getItem("randomNum");
    const totalTiles = localStorage.getItem("totalTiles");
    const store = localStorage.getItem("store");
    const count = localStorage.getItem("count");
    const users = localStorage.getItem("users");

    if(role && roomNo && totalTiles && store && count && users){
      setRole(role);
      setRoomNo(roomNo);
      setTotalTiles(JSON.parse(totalTiles));
      setStore(JSON.parse(store))
      setCount(JSON.parse(count));
      setUsers(JSON.parse(users))
      setLogged(true);
      dialogRef?.current?.close();
      if(randomNum && genNums){
        setRandomNum(Number(randomNum));
        setgenNums(JSON.parse(genNums));
      }
    }
    else{
      dialogRef.current?.showModal();
    }

  },[])

  // useEffect(() => {
  //   console.log(genNums)
  // },[genNums])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const type = formData.get("type");
    const roomCode = formData.get("enterRoom");
    const username = formData.get("username");

    setRole(() => (type === "createRoom" ? "host" : "guest"));
    axios
      .post("http://172.17.10.127:3000/api/room", {
        type,
        roomCode,
        username
      })
      .then((response) => {
        console.log("Success:", response.data);
        if (response.data.success) {
          setLogged(true);
          if (username){
            localStorage.setItem("username",username.toString());
          }
          localStorage.setItem("users", JSON.stringify(response.data.users));
          localStorage.setItem("roomNo", response.data.room);
          localStorage.setItem(
            "role",
            type === "createRoom" ? "host" : "guest"
          );

          localStorage.setItem("count","-1");
          if(username) setUsername(username.toString());

          setUsers(response.data.users);
          setRoomNo(response.data.room);
          setTotalTiles(() => {
            const newTiles = generateUniqueRandomNumbers();
            localStorage.setItem("totalTiles",JSON.stringify(newTiles));
            return newTiles;
          });
          setStore(() => {
            const newStore = generateRanNums();
            localStorage.setItem("store",JSON.stringify(newStore));
            return newStore;
          });
          localStorage.setItem("genNums",JSON.stringify([]))
          toast.success("Welcome to Housie!!!");
          dialogRef.current?.close();
        } else {
          setError(response.data.msg);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to send room details.");
      });
  };

  const generateRanNums = () => {
    const newNumbers: number[] = [];
    while (newNumbers.length <= 90) {
      const randomNumber = randomNumberInRange(1, 91);
      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }
    return newNumbers;
  };

  const generateUniqueRandomNumbers = () => {
    var newNumbers:number[] = [];
    while (newNumbers.length < 27) {
      let index = newNumbers.length;
      const randomNumber = randomNumberInRange(((index % 9) * 10) + 1, ((index % 9) * 10) + 9);
      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }
    const tiles = newNumbers.map(num => { return {number:num,marked:false}})
    return tiles;
  }

  return (
    <div className="grid grid-cols-12 grid-rows-12 w-screen h-screen bg-slate-100 gap-3 p-3">
      <dialog ref={dialogRef} className="bg-slate-100 p-5 rounded-xl w-[500px]">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Select Option
            </label>
            <select
              name="type"
              id="type"
              className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="createRoom">Create Room</option>
              <option value="enterRoom">Enter Room</option>
            </select>
          </div>
          <div className="mb-3">
            <label
              htmlFor="enterRoom"
              className="block text-sm font-medium text-gray-700"
            >
              Room Code
            </label>
            <input
              type="text"
              name="enterRoom"
              id="enterRoom"
              className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter room code"
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:justify-center lg:justify-start">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-center mt-3">{error}</div>
          )}
        </form>
      </dialog>
      {
        logged && <>
        <Sidebar
        role={role}
        randomNum={randomNum}
        setRandomNumber={setRandomNumber}
      />
      <Header logout={logout} />
      <Board setTotalTiles={setTotalTiles} totalTiles={totalTiles} randomNum={randomNum} genNums={genNums} />
      <Participants
        users={users}
      />
        </>
      }
      
    </div>
  );
}

export default App;
