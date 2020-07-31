class DataHandler {

  getData(hotel, src) {
    fetch(`https://fe-apps.herokuapp.com/api/v1/overlook/1904/${src}/${src}`)
      .then(response => response.json())
      .then(data => hotel.storeData(data[src]))
      .catch(err => console.log(err))
  }

  getAllData (hotel) {
    let args = Array.from(arguments);
    args.shift();
    args.forEach(argument => this.getData(hotel, argument))
  }
}

export default DataHandler