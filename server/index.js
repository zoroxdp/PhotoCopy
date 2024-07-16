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
    const player1 = allUsers[socket.id];
    player1.name = data.name;

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


      player1.socket.emit("OpponentFound", {
        opponentName: player2.name,
        playerAs: "P1",
        Points: 0,
      })

      player2.socket.emit("OpponentFound", {
        opponentName: player1.name,
        playerAs: "P2",
        Points: 0,
      })

      player1.socket.on("playerMoveFromClient", (data) => {
        player2.socket.on("playerMoveFromServer", { ...data });
      });
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
