class User {

  createBooking(event, date, userId) {
    const booking = {
      userId,
      date,
      roomNumber: event.target.id,
      roomServiceCharges: []
    }

    console.log(booking)
  }
}

export default User