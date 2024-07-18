import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { nameAtom, opponentNameAtom, opponentStateAtom, resAtom } from '../data/atoms';
import { io } from 'socket.io-client';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import DrawScreen from './DrawScreen';
import CopyScreen from './CopyScreen';

const HomeScreen = () => {
  const [name, setName] = useRecoilState(nameAtom);
  const [opponentName, setOpponentName] = useRecoilState(opponentNameAtom);
  const [opponentState, setOpponentState] = useRecoilState(opponentStateAtom);
  const [res, setRes] = useRecoilState(resAtom);
  const [socket, setSocket] = useState(null);
  const [gameOn, setGameOn] = useState(false);
  const [role, setRole] = useState('');
  const [finishedState, setFinishedState] = useState('');

  useEffect(() => {
    if (opponentName && role) {
      game();
    }
  }, [opponentName, role]);

  useEffect(() => {
    if (name && !socket) {
      const newSocket = io("http://localhost:3000", {
        autoConnect: true,
      });

      newSocket.emit("request_to_play", {
        playerName: name,
      });

      newSocket.on("OpponentFound", (data) => {
        setOpponentName(data.opponentName);
        setRole(data.role);
      });

      newSocket.on("OpponentLeft", () => {
        setFinishedState("opponentLeft");
        Swal.fire({
          title: "Opponent Left",
          showCancelButton: false,
        });
      });

      newSocket.on("Result", (data) => {
        setRes(data.res);
      })

      newSocket.on("StateFromServer", (data) => {
        setOpponentState(data.state);
      })
      setSocket(newSocket);
    }
  }, [name, socket]);

  const inputName = async () => {
    const name = await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Please enter your name first.";
        }
      }
    });
    return name;
  };

  const playButton = async () => {
    const name = await inputName();

    if (!name.isConfirmed) {
      return;
    }

    setName(name.value);
  };

  const game = () => {
    setGameOn(true);
  };

  if (gameOn === false) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col justify-center">
          <img src="/Logo.png" className="w-64 mb-4" alt="logo" />
          <Button onClick={playButton} variant="outlined">Play</Button>
        </div>
      </div>
    );
  } else if (gameOn === true) {
    if (role === 'R1') {
      return <DrawScreen socket={socket} />
    } else if (role === 'R2') {
      return <CopyScreen socket={socket} />
    }
  }
}

export default HomeScreen;
