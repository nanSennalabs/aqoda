const fs = require("fs");

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

let keycard = {};
let room = {};

function main() {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);

  commands.forEach(command => {
    if (!command.name) return;
    switch (command.name) {
      case "create_hotel":
        var [floor, roomPerFloor] = command.params;
        const hotel = { floor, roomPerFloor };
        const totalRoom = floor * roomPerFloor;

        for (let k = 1; k <= totalRoom; k++) {
          keycard = { ...keycard, [k]: { isAvailable: true } };
        }

        for (let i = 1; i <= floor; i++) {
          for (let j = 1; j <= roomPerFloor; j++) {
            room = {
              ...room,
              [`${i}${j.toString().padStart(2, "0")}`]: {
                isAvailable: true
              }
            };
          }
        }
        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        );
        return;

      case "book":
        const key = Object.keys(keycard).find(
          keyNumber => keycard[keyNumber].isAvailable
        );
        checkRoom(command.params, key);
        return;

      case "checkout":
        const [keyNumber, guestName] = command.params;
        const booingRoom =
          Object.values(room).find(booking => booking.key === keyNumber) || {};
        const { id: roomId } = booingRoom;

        if (booingRoom.name !== guestName) {
          console.log(
            `Cannot book room ${roomId} for ${guestName}, The room is currently booked by ${booingRoom.name}.`
          );
        } else {
          console.log(`Room ${roomId} is checkout.`);
          room[roomId] = { isAvailable: true };
          keycard[keyNumber.toString()] = { isAvailable: true };
        }

        return;

      case "list_available_rooms":
        const availableRooms = Object.keys(room).filter(
          roomNumber => room[roomNumber].isAvailable
        );
        console.log(availableRooms.join(", "));
        return;

      case "list_guest":
        const allGuests = Object.values(room)
          .filter(booking => !booking.isAvailable)
          .sort((a, b) => a.key - b.key)
          .map(booking => booking.name);
        console.log(allGuests.join(", "));
        return;

      case "get_guest_in_room":
        const [roomNumber] = command.params;
        const bookingRoom = Object.values(room).find(
          booking => booking.id === roomNumber
        );
        console.log(bookingRoom.name);
        return;

      case "list_guest_by_age":
        const [operator, age] = command.params;
        const guestByAge = Object.values(room)
          .filter(booking => eval(`${booking.age} ${operator} ${age}`))
          .map(booking => booking.name);
        console.log(guestByAge.join(", "));
        return;

      case "list_guest_by_floor":
        var [floor] = command.params;
        const guestByFloor = Object.values(room)
          .filter(booking => booking.floor === floor)
          .map(booking => booking.name);
        console.log(guestByFloor.join(", "));

        return;

      case "checkout_guest_by_floor":
        var [floor] = command.params;
        let roomsCheckout = [];

        Object.values(room).forEach(value => {
          if (value.floor === floor) {
            keycard[value.key] = { isAvailable: true };
            room[value.id] = { isAvailable: true };
            roomsCheckout.push(value.id);
          }
        });

        console.log(`Room ${roomsCheckout.join(", ")} are checkout.`);
        return;

      default:
        console.log(`No command '${command.name}'`);
        return;
    }
  });
}

function checkRoom(data, key) {
  const [roomId, name, age] = data;
  const roomNumber = Object.keys(room).find(
    roomNumber => room[roomNumber].id === roomId
  );
  const roomInfo = room[roomNumber] || null;

  if (roomInfo) {
    console.log(
      `Cannot book room ${roomInfo.id} for ${name}, The room is currently booked by ${roomInfo.name}.`
    );
  } else {
    room[roomId] = {
      id: roomId,
      name,
      age,
      isAvailable: false,
      key: parseInt(key),
      floor: parseInt(roomId.toString()[0])
    };
    keycard[key].isAvailable = false;
    console.log(
      `Room ${roomId} is booked by ${room[roomId].name} with keycard number ${room[roomId].key}`
    );
  }
}

function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, "utf-8");

  return file
    .split("\n")
    .map(line => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map(param => {
            const parsedParam = parseInt(param, 10);

            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    );
}

main();
