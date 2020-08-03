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
}

export default DataHandler
