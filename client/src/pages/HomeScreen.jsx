import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { nameAtom, opponentNameAtom } from '../data/atoms';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useRecoilState(nameAtom);
  const [opponentName, setOpponentName] = useRecoilState(opponentNameAtom);
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
    if (playerName && !socket) {
      const newSocket = io("http://localhost:3000", {
        autoConnect: true,
      });

      newSocket.emit("request_to_play", {
        playerName: playerName,
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

      setSocket(newSocket);
    }
  }, [playerName, socket]);

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

    setPlayerName(name.value);
  };

  const game = () => {
    console.log(role, playerName);
    setGameOn(true);
    if (role === "R1") {
      navigate('/draw');
    } else {
      navigate('/guess');
    }
  };

  if (!gameOn) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col justify-center">
          <img src="/Logo.png" className="w-64 mb-4" alt="logo" />
          <Button onClick={playButton} variant="outlined">Play</Button>
        </div>
      </div>
    );
  }
  else {
    return <div className="text-white">Hello</div>;
  }
}

export default HomeScreen;
