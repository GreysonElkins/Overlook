class User {

  createBooking(room, date, userID) {
    const booking = {
      "userID": userID,
      "date": date,
      "roomNumber": room
    }
    return booking
  }  
}

export default User