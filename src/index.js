import './css/base.scss';
import './css/user-pane.scss'
import './css/room-cards.scss';

import './images/background.png';
import './images/user-icon.png';
import './images/overlook.jpg';
import './images/single-room.jpg';
import './images/residential-suite.jpg';
import './images/junior-suite.jpg';
import './images/suite.jpg';
import Manager from './Manager'
import Customer from './Customer'

import page from './Page'

let buttons = document.querySelectorAll('button')
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', buttonHandler)
}

function buttonHandler(event) {

  if (event.target.id === 'log-in') {
    event.preventDefault()
    const userCredentials = page.getLogInInfoFromForm()
    page.hotel.authenticateUser(userCredentials, page)
      .then(() => {
        if (page.currentUser !== undefined) {
          page.goToRoomsPage()  
          setTimeout(setBookingButtons, 1000)
        }
      })
  } else if (event.target.id === 'rooms-button') {
    page.goToRoomsPage();
  } else if (event.target.id === 'user-bar-signed-out') {
    page.showElements('.sign-in-pop-up')
  } else if (event.target.id === 'sign-out') {
    page.hotel.currentUser = undefined
    location.reload()
  } else if (event.target.id === 'filter-rooms') {
    console.log(page)
    page.checkTags()
    setTimeout(setBookingButtons, 1000)
  } else if (event.target.id.includes('submit-user')) {
    page.setUserToBook(event)
  } else if (event.target.id === 'user-search')
    page.searchForBookings()
}

const pressBookingButton = (event) => {
  console.log(page)
  if (page.currentUser instanceof Customer) {
    page.findCustomerBookingData(event)
  } else if (page.currentUser instanceof Manager) {
    page.hotel.getData('users')
      .then(() => {
        page.showElements('#booking-pop-up')
        let roomToBook = event.target.id
        const button = document.getElementById('submit-user')
        button.id = `${button.id}${roomToBook}`
      })
  }
}

const setBookingButtons = () => {
  const bookingButtons = document.querySelectorAll('.booking-button')
  for (let i = 0; i < bookingButtons.length; i++) {
    bookingButtons[i].addEventListener('click', pressBookingButton)
  }
}