import Page from './Page'
import Hotel from './Hotel'
// I wanted this to be an object, but couldn't get it 
// to run findButtons on instantiation
class EventHandler {
  constructor() {
    this.buttons = this.findButtons()
  }

  findButtons() {
    let buttons = document.querySelectorAll('button')
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', this.buttonHandler)
    }
    return buttons
  }

  buttonHandler(event, page = new Page()) {

    if (event.target.id === 'log-in') {
      event.preventDefault()
      const userCredentials = page.getLogInInfoFromForm()
      page.hotel.authenticateUser(userCredentials)
        .then(() => {
          if (page.hotel.currentUser !== undefined) {
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
      page.checkTags()
    }
    
    const pressBookingButton = () => {
      page.findBookingData(event)
    }
  
    const setBookingButtons = () => {
      const bookingButtons = document.querySelectorAll('.booking-button')
      for (let i = 0; i < bookingButtons.length; i++) {
        bookingButtons[i].addEventListener('click', pressBookingButton)
      }
    }
  }
}

export default EventHandler