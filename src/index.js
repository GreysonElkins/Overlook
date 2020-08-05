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
        if (page.currentUser === undefined) {
          page.showElements('#login-message')
        } else {
          page.goToRoomsPage()  
        }
      })
  } else if (event.target.id === 'see-all-rooms') {
    page.goToRoomsPage();
  } else if (event.target.id === 'user-bar-signed-out') {
    page.showElements('.sign-in-pop-up')
  } else if (event.target.id === 'sign-out') {
    page.hotel.currentUser = undefined
    location.reload()
  } else if (event.target.id === 'filter-rooms') {
    page.checkTags()
  } else if (event.target.id.includes('submit-user')) {
    page.setUserToBook(event)
  } else if (event.target.id === 'user-search')
    page.searchForBookings()
}
