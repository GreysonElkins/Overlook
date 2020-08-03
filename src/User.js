class User {

  createBooking(room, date, userID) {
    const booking = {
      userID,
      date,
      roomNumber: room,
      roomServiceCharges: []
    }

    console.log(booking)
  }
}

export default User