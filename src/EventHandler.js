import Page from './Page'
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
      page.getLogInInfoFromForm()
      page.goToRoomsPage()
    }
  }

}

export default EventHandler