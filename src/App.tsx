import { useEffect, useState } from "react";
import Board from "./components/Board";
import Sidebar from "./components/Sidebar";
import { socket } from "./components/Socket";
import {  toast } from "react-toastify";
import { useRef } from "react";
import axios from "axios";
import Participants from "./components/Participants";
import Header from "./components/Header";
import { Loader2 } from "lucide-react";

const URL = import.meta.env.VITE_SOCKET_URL;

export const randomNumberInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

type tile = {
  number: number;
  marked: boolean;
};

export type user = {
  username: string;
  micAllowed: boolean;
};

function App() {
  const [randomNum, setRandomNum] = useState(0);
  const [genNums, setgenNums] = useState<number[]>([]);
  const [store, setStore] = useState<number[]>([]);
  const [, setCount] = useState(-1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [role, setRole] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [roomNo, setRoomNo] = useState<string>("");
  const [totalTiles, setTotalTiles] = useState<tile[]>([]);
  const [users, setUsers] = useState<user[]>([]);
  const [logged, setLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allowTalk, setAllowTalk] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [clicked, setClicked] = useState(false);
  const [exitMessage, setExitMessage] = useState<string>(
    "🎊🎉✨Yayy! Housee!!!!"
  );
  const [intervalId, setIntervalId] = useState<number>(0);
  const [counter,setCounter] = useState<number>(5);
  const [counterInterval,setCounterInterval] = useState<number>(0)

  const handleClick = () => {
    setClicked((prev) => {
      const newVal = !prev;
      localStorage.setItem("isGameStarted",JSON.stringify(newVal));
      if(!newVal){
        if(intervalId){
          clearInterval(intervalId);
          setIntervalId(0);
        }
        if(counterInterval){
          clearInterval(counterInterval);
          setCounterInterval(0);
        }
      }
      return newVal;
    });
  };

  const emitGameCompleteSignal = () => {
    socket.emit("win", username, roomNo);
  };

  const clearFields = () => {
    localStorage.clear();
    dialogRef.current?.showModal();
    setLogged(false);
    setRandomNum(0);
    setgenNums([]);
    setStore([]);
    setCount(-1);
    setRole("");
    setRoomNo("");
    setTotalTiles([]);
    setUsers([]);
    setUsername("");
    setExitMessage("🎊🎉✨Yayy! Housee!!!!");
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const logout = () => {
    clearFields();
    socket.emit("exit", username, roomNo, role);
  };

  const handleAllowTalk = () => {
    setAllowTalk((prev) => {
      const isAllowed = !prev;
      if (isAllowed) {
        startRecording();
      } else {
        stopRecording();
      }
      socket.emit("micAllowed", username, roomNo, isAllowed);
      return isAllowed;
    });
  };

  const setRandomNumber = () => {
    handleClick();
    console.log("inside setr");

    if(!counterInterval){
      const newIntervalId = setInterval(() => {
        setCounter(prev => {
          let newCounterVal = prev-1;
          if(newCounterVal === 0){
            newCounterVal = 5;
          }
          localStorage.setItem("counter",JSON.stringify(newCounterVal));
          return newCounterVal;
        })
      },1000)
      setCounterInterval(newIntervalId);
    }

    if (!intervalId) {
      console.log("inside inter");
      
      const newIntervalId = setInterval(() => {
        setCount((prev) => {
          const next = prev + 1;
    
          localStorage.setItem("randomNum", store[next].toString());
          localStorage.setItem("count", next.toString());
    
          setRandomNum(store[next]);
          setgenNums(prev => {
            const newVal = [...prev, store[next]];
            localStorage.setItem(
              "genNums",
              JSON.stringify(newVal)
            );
            return newVal;
        });
          socket.emit("housie", store[next], role, roomNo, [
            ...genNums,
            store[next],
          ]);
          return next;
        });
      }, 5000); 
      setIntervalId(newIntervalId);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (counterInterval) {
        clearInterval(counterInterval);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    socket.connect();
    // console.log("called",role);

    socket.emit("entered", role, roomNo, username);

    socket.on("entered", (role, room, updatedUsers : user[]) => {
      console.log(updatedUsers)
      if (role === "guest" && room === roomNo) {
        // console.log(users,username);
        // const newUsers = [{username,micAllowed:false},{username:user,micAllowed:false},...users.filter(user => user.username != username && user.username != "")];
        // localStorage.setItem("users",JSON.stringify(newUsers));
        setUsers(() => {
          // const newUsers = [
          //   { username : username, micAllowed: allowTalk },
          //   ...updatedUsers?.filter(
          //     (user : user) => user.username != username && user.username != ""
          //   ),
          // ];
          const newUsers = updatedUsers;
          localStorage.setItem("users", JSON.stringify(newUsers));
          // const uniqueUsers = newUsers.reduce((acc: user[], user: user) => {
          //   // Check if user already exists in accumulator
          //   if (
          //     !acc.some(
          //       (existingUser: user) => existingUser.username === user.username
          //     )
          //   ) {
          //     acc.push(user);
          //   }
          //   return acc;
          // }, []);
          // console.log(uniqueUsers)
          return newUsers;
        });
        // setUsers(newUsers);
      }
    });

    socket.on("win", (user, room) => {
      if (room === roomNo && localStorage.getItem("housee") === "false") {
        setExitMessage(user + " has won the game 🎊🎉✨");
      }
    });

    socket.on("exit", (remainUsers, exitedRoom, exitedRole) => {
      if (exitedRoom === roomNo) {
        if (exitedRole === "host") {
          clearFields();
        } else if (exitedRole === "guest") {
          setUsers(() => remainUsers);
        }
      }
    });

    socket.on("micAllowed", (username, room, isAllowed) => {
      if (room === roomNo) {
        setUsers((prev) =>
          prev.map((user) =>
            user.username === username
              ? { ...user, micAllowed: isAllowed }
              : user
          )
        );
      }
    });

    socket.on("audioStream", (audioData, room) => {
      if (room === roomNo) {
        // console.log("talking: "+room+" "+roomNo)
        var newData = audioData.split(";");
        newData[0] = "data:audio/ogg;";
        newData = newData[0] + newData[1];

        var audio = new Audio(newData);
        // console.log(audio);
        if (!audio || document.hidden) {
          // console.log("returned")
          return;
        }
        audio.play();
      }
    });

    socket.on(
      "housie",
      (number: number, roomNo: string, genNums: number[], users: string[]) => {
        // console.log(role,srole);
        if (role === "guest" && roomNo === roomNo) {
          // localStorage.setItem("randomNum",number.toString())
          setCount((prev) => {
            const next = prev + 1;
            // console.log([...genNums, number],randomNum,count)
            localStorage.setItem("randomNum", number.toString());
            localStorage.setItem(
              "genNums",
              JSON.stringify([...genNums, number])
            );
            localStorage.setItem("count", next.toString());
            localStorage.setItem("users", JSON.stringify(users));
            // setUsers(users)
            setRandomNum(number);
            setgenNums([...genNums, number]);
            return next;
          });
        }
        // else if(closed){
        //   logout();
        // }
      }
    );

    return () => {
      socket.off("housie");
      socket.disconnect();
    };
  }, [role, roomNo, username]);

  const startRecording = () => {
    // console.log("strted recording")
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        var mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        var audioChunks: Blob[] = [];

        // console.log("recording... "+mediaRecorder.state)

        // mediaRecorder.ondataavailable = (event) => {
        //   audioChunksRef.current.push(event.data);
        //   console.log("hello")
        //   const audioBlob = new Blob(audioChunksRef.current);
        //   const fileReader = new FileReader();
        //   fileReader.readAsDataURL(audioBlob);

        //   fileReader.onloadend = () => {
        //     const base64AudioData = fileReader.result;
        //     if (base64AudioData) {
        //       console.log("base64")
        //       // Emit audio data via socket to the server
        //       socket.emit("audioStream", base64AudioData, roomNo);
        //     }
        //     audioChunksRef.current = [];
        //   };

        //   // Clear the audio chunks to avoid storing too much data in memory
        //   // audioChunksRef.current = [];
        // };

        mediaRecorder.addEventListener("dataavailable", function (event) {
          audioChunks.push(event.data);
          // audioChunksRef.current.push(event.data);
          // console.log("available")
        });

        mediaRecorder.addEventListener("stop", function () {
          // console.log("stopped")
          // var audioBlob = new Blob(audioChunksRef.current);
          var audioBlob = new Blob(audioChunks);
          audioChunks = [];
          var fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);
          fileReader.onloadend = function () {
            var base64String = fileReader.result;
            socket.emit("audioStream", base64String, roomNo, username);
          };
          // console.log("allowtak jfejf: "+allowTalk)
          if (allowTalk) {
            // console.log("allowed talk")
          }
          mediaRecorder.start();
          setTimeout(function () {
            mediaRecorder.stop();
          }, 1000);
        });

        mediaRecorder.start();
        setTimeout(function () {
          mediaRecorder.stop();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error capturing audio.", error);
      });
  };

  const stopRecording = () => {
    // console.log("stopping recording")
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      // console.log("active")
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current = null;
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    const roomNo = localStorage.getItem("roomNo");
    const genNums = localStorage.getItem("genNums");
    const randomNum = localStorage.getItem("randomNum");
    const totalTiles = localStorage.getItem("totalTiles");
    const store = localStorage.getItem("store");
    const count = localStorage.getItem("count");
    const users = localStorage.getItem("users");
    const username = localStorage.getItem("username");
    // const isGameStarted = localStorage.getItem("isGameStarted")
    const counterVal = localStorage.getItem("counter");

    if (role && roomNo && totalTiles && store && count && users && username) {
      setRole(role);
      setRoomNo(roomNo);
      setTotalTiles(JSON.parse(totalTiles));
      setStore(JSON.parse(store));
      setCount(JSON.parse(count));
      setUsers(() => {
        var newUsers = JSON.parse(users);
        return newUsers;
      });
      if(counterVal) setCounter(JSON.parse(counterVal)) 
      setUsername(username);
      setLogged(true);
      dialogRef?.current?.close();
      if (randomNum && genNums) {
        setRandomNum(Number(randomNum));
        setgenNums(JSON.parse(genNums));
      }
    } else {
      dialogRef.current?.showModal();
    }
    // console.log(URL)
  }, []);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const type = formData.get("type");
    const roomCode = formData.get("enterRoom");
    var user = formData.get("username");
    if (user)
      user =
        user.toString().charAt(0).toUpperCase() + user.toString().substring(1);
    setRole(() => (type === "createRoom" ? "host" : "guest"));
    setIsLoading(true);
    axios
      .post(`${URL}/api/room`, {
        type,
        roomCode,
        user,
      })
      .then((response) => {
        // console.log("Success:", response.data);
        if (response.data.success) {
          setLogged(true);
          if (user) {
            localStorage.setItem("username", user.toString());
            setUsername(user.toString());
          }
          localStorage.setItem("users", JSON.stringify(response.data.users));
          localStorage.setItem("roomNo", response.data.room);
          localStorage.setItem(
            "role",
            type === "createRoom" ? "host" : "guest"
          );

          localStorage.setItem("count", "-1");

          setUsers(() => {
            var newUsers = [
              { username: user, micAllowed: false },
              ...response.data.users.filter((u: user) => u.username !== user),
            ];
            const uniqueUsers = newUsers.reduce((acc: user[], user: user) => {
              // Check if user already exists in accumulator
              if (
                !acc.some(
                  (existingUser: user) =>
                    existingUser.username === user.username
                )
              ) {
                acc.push(user);
              }
              return acc;
            }, []);
            // console.log(uniqueUsers)
            return uniqueUsers;
          });

          // setUsers([{username : user,micAllowed:false},...response.data.users.filter((u:user) => u.username !== user)]);
          setRoomNo(response.data.room);
          setTotalTiles(() => {
            const newTiles = generateUniqueRandomNumbers();
            localStorage.setItem("totalTiles", JSON.stringify(newTiles));
            return newTiles;
          });
          setStore(() => {
            const newStore = generateRanNums();
            localStorage.setItem("store", JSON.stringify(newStore));
            return newStore;
          });
          localStorage.setItem("genNums", JSON.stringify([]));
          toast.success("Welcome to Housie!!!");
          dialogRef.current?.close();
        } else {
          setError(response.data.msg);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to send room details.");
      })
      .finally(() => {
        setIsLoading(false);
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
    var newNumbers: number[] = [];
    while (newNumbers.length < 27) {
      let index = newNumbers.length;
      const randomNumber = randomNumberInRange(
        (index % 9) * 10 + 1,
        (index % 9) * 10 + 9
      );
      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }
    const tiles = newNumbers.map((num) => {
      return { number: num, marked: false };
    });
    return tiles;
  };

  return (
    <div className="grid grid-cols-12 grid-rows-12 w-screen h-screen bg-softColor gap-2 p-1 md:gap-3 md:p-3">

      <dialog
        ref={dialogRef}
        className="shadow-softShadow bg-softColor p-5 rounded-xl w-[500px]"
      >
        <form ref={formRef} onSubmit={handleSubmit}>
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
              className="bg-softColor shadow-softShdowInner mt-1 block w-full p-3 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none"
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
              className="bg-softColor shadow-softShdowInner outline-none mt-1 p-3 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="bg-softColor shadow-softShdowInner outline-none mt-1 p-3 block w-full rounded-md border-gray-300 sm:text-sm"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:justify-center lg:justify-start">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? (
                <Loader2 className="text-white animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-center mt-3">{error}</div>
          )}
        </form>
      </dialog>
      {logged && (
        <>
          <Sidebar
            role={role}
            randomNum={randomNum}
            setRandomNumber={setRandomNumber}
            clicked={clicked}
            handleClick={handleClick}
            counter={counter}
          />
          <Header logout={logout} />
          <Board
            exitMessage={exitMessage}
            emitGameCompleteSignal={emitGameCompleteSignal}
            logout={logout}
            setTotalTiles={setTotalTiles}
            totalTiles={totalTiles}
            randomNum={randomNum}
            genNums={genNums}
          />
          <Participants
            users={users}
            allowTalk={allowTalk}
            handleAllowTalk={handleAllowTalk}
            username={username}
          />
        </>
      )}
    </div>
  );
}

export default App;
