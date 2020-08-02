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
          }
        })
      // isAuthorized ? load next page: message on DOM, clear inputs
      // test line 23
    } else if (event.target.id === 'rooms-button') {
      page.goToRoomsPage();
    } else if (event.target.id === 'user-bar-signed-out') {
      page.showElements('.sign-in-pop-up')
    } else if (event.target.id === 'sign-out') {
      page.hotel.currentUser = undefined
      location.reload()
    }
  }
}

export default EventHandler