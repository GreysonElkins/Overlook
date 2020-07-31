class Customer {
  constructor(user, bookings = [], rooms = []) {
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
      return sum
    }, 0)
  }
}

export default Customer