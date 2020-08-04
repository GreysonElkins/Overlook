import User from './User'

class Customer extends User {
  constructor(user, bookings = [], rooms = []) {
    super()
    this.id = user.id
    this.name = user.name
    this.bookings = this.findBookings(bookings)
    this.accountBalance = this.findAccountBalance(rooms)
  }

  findBookings(bookings) {
    return bookings.filter(booking => booking.userID === this.id)
  }

  findAccountBalance(rooms) {
    const bookedRoomNumbers = this.bookings.map(booking => booking.roomNumber)
    return rooms.reduce((sum, room) => {
      if (bookedRoomNumbers.includes(room.number)) {
        sum += room.costPerNight
      }
      return parseFloat(sum.toFixed(2))
    }, 0)
  }

  createBooking(room, date) {
    return super.createBooking(room, date, this.id)
  }

}

export default Customer