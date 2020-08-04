class DataHandler {

  getData(src, hotel) {
    const apiHead = `https://fe-apps.herokuapp.com/api/v1/overlook/1904`
    return fetch(`${apiHead}/${src}/${src}`)
      .then(response => response.json())
      .then(data => hotel.storeData(data[src]))
      .catch(err => console.log(err))
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
      .then(response => {
        if (response.ok) {
          alert(`Thanks for planning a trip with us, we look` +
            ' forward to your stay!')
        } else {
          throw new Error('Something went wrong')
        }
      }) 
      .catch(error => {
        alert(`Something went wrong, please try again`)
        console.log(error)
      })
  }

  deleteBooking(id) {
    fetch(`https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings`, {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"id": id}),
    })
      // .then(response => response.json())
      // .then(data => {
      //   console.log(data);
      // })
      // .catch((err) => console.log(err));
  }
  // also, will this response be empty if successful?

}

export default DataHandler
