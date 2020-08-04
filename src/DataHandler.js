class DataHandler {

  getData(src, hotel) {
    const apiHead = `https://fe-apps.herokuapp.com/api/v1/overlook/1904`
    return fetch(`${apiHead}/${src}/${src}`)
      .then(response => response.json())
      .then(data => hotel.storeData(data[src]))
      .catch(err => console.log(err))
  }

  getAllData (hotel) {
    let args = Array.from(arguments);
    args.shift();
    return args.forEach(argument => this.getData(argument, hotel))
  }

  makeBooking(booking) {
    fetch(
      `https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
      })
      .then(response => response.json)
      .then(() => alert(`Thanks for planning a trip with us, we look` +
      ' forward to your stay!'))
      .catch(error => {
        alert(`Something went wrong, please try again`)
        console.log(error)
      })
  }

  // deleteBooking(event) {
  //   fetch(
  //     `https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings/${event.target.id}`,
  //     {
  //       method: 'DELETE'
  //     })
  //     .then(response => response.json)
  // }

  deleteBooking(event) {
    fetch(`https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings`, {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"id": event}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Success', data);
      })
      .catch((err) => console.log(err));
  }

}

export default DataHandler
