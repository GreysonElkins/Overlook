import Page from './Page'
import Hotel from './Hotel'
// I wanted this to be an object, but couldn't get it 
// to run findButtons on instantiation
class EventHandler {
  constructor(hotel) {
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

  buttonHandler(event, page = new Page()) {
    if (event.target.id === 'log-in') {
      event.preventDefault()
      page.getLogInInfoFromForm()
    }
  }
}

export default EventHandler