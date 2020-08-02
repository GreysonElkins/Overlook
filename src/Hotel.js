import DataHandler from './DataHandler'
import Customer from './Customer'
import Manager from './Manager';

class Hotel extends DataHandler {
  constructor() {
    super();
    this.rooms;
    this.bookings;
    this.users;
  }

  storeData(input) {
    if (!Array.isArray(input)) return 'unexpected data type'
    const dataCategory = this.determineDataCategory(input)
    if (dataCategory !== 'unexpected data type') {
      this[dataCategory] = input;
    }
  }

  hasData(input) {
    if (this[input] === undefined) {
      return false
    } else {
      return true
    }
  }

  determineDataCategory(input) {
    const roomDataRequirements = [
      'number', 
      'roomType', 
      'bidet', 
      'bedSize', 
      'numBeds', 
      'costPerNight'
    ]
    const bookingDataRequirements = [
      'id',
      'userID', 
      'date', 
      'roomNumber', 
      'roomServiceCharges'
    ]
    const userDataRequirements = ['id', 'name'];
    let dataPoints;
    
    if (!Array.isArray(input)) return 'unexpected data type'
    
    if (typeof input[0] === 'object' && !Array.isArray(input[0])) {
      dataPoints = Object.keys(input[0])
    } else {
      return 'unexpected data type'
    }

    if (roomDataRequirements.every(key => dataPoints.includes(key))) {
      return 'rooms'
    } else if (bookingDataRequirements.every(key => dataPoints.includes(key))) {
      return 'bookings'
    } else if (userDataRequirements.every(key => dataPoints.includes(key))) {
      return 'users' 
    } else {
      return 'unexpected data type'
    }
  }

  findAvailableRooms(date) {
    if (this.isDate(date) === false) return 'The date is an unexpected format'
    let bookedRooms = this.findBookedRoomNumbers(date)
    if (!Array.isArray(bookedRooms)) return bookedRooms
    if (!this.hasData('rooms')) return 'This hotel is missing room data'

    let availableRooms = this.rooms.filter(room => {
      if (!bookedRooms.includes(room.number)) return room
    })
    
    if (availableRooms.length > 0) {
      return availableRooms
    } else {
      return 'We\'re so sorry but we`re all booked for that date' +
      ' you\'ll be sorely missed, we hope you\'ll find another night to join us'
    }
  } 

  findBookedRoomNumbers(date) {
    if (!this.hasData('bookings')) return 'This hotel is missing booking data'
    return this.bookings.reduce((roomNumbers, booking) => {
      if (booking.date === date) roomNumbers.push(booking.roomNumber)
      return roomNumbers
    }, [])
  }

  findAvailableRoomsByType(roomType, date) {
    if (!this.isDate(date)) return 'The date is an unexpected format'
    let availableRooms = this.findAvailableRooms(date)
    if (!Array.isArray(availableRooms)) return availableRooms
    let availableRoomType = availableRooms.filter(room => {
      if (room.roomType === roomType) return room
    })

    if (availableRooms === 'This hotel is missing room data') {
      return 'This hotel is missing room data'
    } else if (availableRoomType.length > 0) {
      return availableRoomType
    } else {
      return `We're so sorry but none of the ${roomType}s ` +
      `are available on that date, please try finding another room`
    }
  }

  calculateDailyRevenue(date) {
    let bookedRooms = this.findBookedRoomNumbers(date);
    if (!Array.isArray(bookedRooms)) return bookedRooms
    return this.rooms.reduce((revenue, room) => {
      if (bookedRooms.includes(room.number)) {
        revenue += room.costPerNight
      }
      return revenue
    }, 0)
  }

  isDate(date) {
    if (typeof date !== "string") return false;
    date = date.split("/");
    if (
      date[0].length === 4 &&
      date[1].length === 2 &&
      date[2].length === 2 &&
      date.every((number) => parseInt(number))
    ) {
      return true;
    } else {
      return false;
    }
  }

  findUser(info) {
    if (!this.hasData('users')) return 'This hotel is missing user data'
    const result = this.users.find(user => {
      if (Object.values(user).includes(info)) {
        return user
      }
    })

    if (result === undefined) {
      return 'No user was found, please adjust your search'
    } else {
      return result
    }
  }
  
  authenticateUser(credentials) {
    let password = "overlook2020"
    if (credentials.username === "manager" 
    && credentials.password === password) {
      this.currentUser = new Manager()
      return this.currentUser
    } else if (credentials.username.includes('customer') 
    && credentials.password === password) {
      return this.getData('users')
        .then(() => {
          if (this.checkUserId(credentials.username) !== false) {
            return this.currentUser = this.checkUserId(credentials.username)
          }
        })
    }
  }

  checkUserId(username) {
    const id = parseInt(username.substring(8))
    const currentUser = this.findUser(id)
    console.log(id, console.log(currentUser))
    if (currentUser !== 'No user was found, please adjust your search') {
      return new Customer(currentUser, this.bookings, this.rooms)
    } else {
      return false
    }
  }

  getData(src) {
    return super.getData(src, this)
  }
}



export default Hotel