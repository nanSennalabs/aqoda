const fs = require("fs");

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

function main() {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);
  let keycard = {};
  let room = {};

  commands.forEach((command) => {
    switch (command.name) {
      case "create_hotel":
        const [floor, roomPerFloor] = command.params;
        const hotel = { floor, roomPerFloor };
        const tatolRoom = floor * roomPerFloor;

        for (let k = 1; k <= tatolRoom; k++) {
          keycard = { ...keycard, [k]: { isAvailable: true } };
        }

        for (let i = 1; i <= floor; i++) {
          for (let j = 1; j <= roomPerFloor; j++) {
            room = {
              ...room,
              [`${i}0${j}`]: {
                isAvailable: true,
              },
            };
          }
        }
        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        );
        return;
      case "book":
        
        checkRoom(command.params, 1);
      default:
        return;
    }
  });
}

function checkRoom(data, key) {
  const [roomId, name, age] = data;
  const roomInfo = room.find((info) => info.id === roomId);
  const motAvailable = keycard[key].isAvailable;
  const keyRoom = key;

  if (motAvailable) {
  }
  console.log("data", data, "roomInfo", "roomInfo");
  if (roomInfo !== {}) {
    console.log(
      `Cannot book room ${roomInfo.id} for ${name}, The room is currently booked by ${roomInfo}.`
    );
  } else {
    room[roomId] = {
      id: roomId,
      name,
      age,
      isAvailable: false,
      key: keyRoom,
    };
    console.log(
      `Room ${roomId} is booked by ${room[roomId].name} with keycard number ${room[roomId].key}`
    );
  }
}

function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, "utf-8");

  return file
    .split("\n")
    .map((line) => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10);

            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    );
}

main();
