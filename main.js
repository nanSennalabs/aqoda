const fs = require('fs')

class Command {
  constructor(name, params) {
    this.name = name
    this.params = params
  }
}

let keycard = {}
let room = {}

function main() {
  const filename = 'input.txt'
  const commands = getCommandsFromFileName(filename)

  commands.forEach((command) => {
    switch (command.name) {
      case 'create_hotel':
        const [floor, roomPerFloor] = command.params
        const hotel = { floor, roomPerFloor }
        const totalRoom = floor * roomPerFloor

        for (let k = 1; k <= totalRoom; k++) {
          keycard = { ...keycard, [k]: { isAvailable: true } }
        }

        for (let i = 1; i <= floor; i++) {
          for (let j = 1; j <= roomPerFloor; j++) {
            room = {
              ...room,
              [`${i}${j.toString().padStart(2, '0')}`]: {
                isAvailable: true
              }
            }
          }
        }
        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        )
        return
      case 'book':
        const key = Object.keys(keycard).find(
          (keyNumber) => keycard[keyNumber].isAvailable
        )
        checkRoom(command.params, key)
      default:
        return
    }
  })
}

function checkRoom(data, key) {
  const [roomId, name, age] = data
  const roomNumber = Object.keys(room).find(
    (roomNumber) => room[roomNumber].id === roomId
  )
  const roomInfo = room[roomNumber] || null

  if (roomInfo) {
    console.log(
      `Cannot book room ${roomInfo.id} for ${name}, The room is currently booked by ${roomInfo.name}.`
    )
  } else {
    room[roomId] = {
      id: roomId,
      name,
      age,
      isAvailable: false,
      key
    }
    keycard[key].isAvailable = false
    console.log(
      `Room ${roomId} is booked by ${room[roomId].name} with keycard number ${room[roomId].key}`
    )
  }
}

function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, 'utf-8')

  return file
    .split('\n')
    .map((line) => line.split(' '))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10)

            return Number.isNaN(parsedParam) ? param : parsedParam
          })
        )
    )
}

main()
