import './css/base.scss'

import './images/background.png'
import './images/user-icon.png'
import './images/overlook.jpg'

import Hotel from './Hotel'

const overlook = new Hotel()

const getData = (src, saveLocation) => {
  fetch(`https://fe-apps.herokuapp.com/api/v1/overlook/1904/${src}/${src}`)
    .then(response => response.json())
    .then(data => saveLocation.storeData(data[src]))
    .catch(err => console.log(err))
}

function getAllData(saveLocation) {
  let args = Array.from(arguments);
  args.shift();
  args.forEach(argument => getData(argument, saveLocation))
}

getAllData(overlook, 'users', 'rooms', 'bookings')