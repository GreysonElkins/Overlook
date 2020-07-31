import Page from './Page'
import Hotel from './Hotel'
// I wanted this to be an object, but couldn't get it 
// to run findButtons on instantiation
class EventHandler {
  constructor() {
    this.hotel = new Hotel ();
    this.buttons = this.findButtons()
  }

  findButtons() {
    let buttons = document.querySelectorAll('button')
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', this.buttonHandler)
    }
    return buttons
  }

  buttonHandler(event, page = new Page(), hotel = this.hotel) {
    if (event.target.id === 'log-in') {
      event.preventDefault()
      const userCredentials = page.getLogInInfoFromForm()
      let isAuthorized = hotel.authenticateUser(userCredentials)
      if (isAuthorized === true) {
        // this.loggedIn = true
      }
      // isAuthorized ? load next page: message on DOM, clear inputs
      // test line 23
    }
  }
}

export default EventHandler