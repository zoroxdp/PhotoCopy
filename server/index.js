const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { cors: "http://localhost:5173/", });

const allPlayers = {};
const allRooms = [];

io.on("connection", (socket) => {
  allPlayers[socket.id] = {
    socket: socket,
    online: true,
    points: 0,
  };

  socket.on("request_to_play", (data) => {
    const player1 = allPlayers[socket.id];
    player1.name = data.playerName;

    let player2;

    for (const key in allPlayers) {
      const player = allPlayers[key];
      if (player.online && !player.playing && key !== socket.id) {
        player2 = player;
        break;
      }
    }

    if (player2) {
      allRooms.push({
        player1: player1,
        player2: player2
      });

      player1.playing = true;
      player2.playing = true;

      player1.socket.emit("OpponentFound", {
        opponentName: player2.name,
        role: "R2"
      })

      player2.socket.emit("OpponentFound", {
        opponentName: player1.name,
        role: "R1"
      })

      player1.socket.on("StateFromClient", (data) => {
        player2.socket.emit("StateFromServer", { ...data });
      });

      player2.socket.on("StateFromClient", (data) => {
        player1.socket.emit("StateFromServer", { ...data });
      });

      player1.socket.on("Result", (data) => {
        player2.socket.emit("Result", { ...data });
      })

      player2.socket.on("Result", (data) => {
        player1.socket.emit("Result", { ...data });
      })

    } else {
      player1.socket.emit("OpponentNotFound");
    }
  });

  socket.on("disconnect", () => {
    const player = allPlayers[socket.id];
    player.online = false;
    player.playing = false;

    for (let i = 0; i < allRooms.length; i++) {
      const { player1, player2 } = allRooms[i];

      if (player1.socket.id === socket.id) {
        player2.socket.emit("OpponentLeft");
        break;
      }
      if (player2.socket.id === socket.id) {
        player1.socket.emit("OpponentLeft");
        break;
      }
    }
  });
});

httpServer.listen(3000);
