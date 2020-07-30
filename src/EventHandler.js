import Page from './Page'

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
      page.goToRoomsPage()
    }
  }

}

export default EventHandler