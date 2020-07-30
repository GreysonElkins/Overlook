import EventHelper from './EventHelper'

class Page {
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

  buttonHandler(event, helper = new EventHelper()) {
    if (event.target.id === 'log-in') {
      helper.goToRoomsPage()
    }
  }

}

export default Page