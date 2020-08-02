import Hotel from "./Hotel"
import Manager from "./Manager"
import Customer from "./Customer"
import { users } from "../test/faux-data"


class Page {
  constructor() {
    this.hotel = new Hotel()
  }
  getLogInInfoFromForm() {
    const inputs = document.querySelectorAll('input')
    const userCredentials = {}
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].id === 'username') {
        userCredentials.username = inputs[i].value
      } else if (inputs[i].id === 'password') {
        userCredentials.password = inputs[i].value
      }
    }
    return userCredentials
  }

  hideElements() {
    const args = Array.from(arguments)
    args.forEach(argument => {
      const element = document.querySelectorAll(argument)
      element.forEach(thing => thing.classList.add('hidden'))
      // element.classList.add('hidden')
    })
  }

  showElements() {
    const args = Array.from(arguments)
    args.forEach(argument => {
      const element = document.querySelectorAll(argument)
      element.forEach((thing) => thing.classList.remove("hidden"));  
      // element.classList.remove('hidden')
    })
  }

  goToRoomsPage() {
    this.populateRoomCards() 
      .then(() => this.findLoggedInElements())
    this.hideElements('.home-page', '.sign-in-pop-up')
    this.showElements('.rooms-page', '.sign-in-or-out')
    // this.findLoggedInElements()
  }
  
  populateRoomCards(hotel = this.hotel) {
    return hotel.getData('rooms') 
      .then(() => {
        const container = document.getElementById('card-container')
        this.hotel.rooms.forEach(room => {
          container.insertAdjacentHTML('beforeend', this.roomCardTemplate(room))
        })
      })
  }
  
  roomCardTemplate(room) {
    return `
      <section class="card" tabindex="0">
        <div class="card-title">
          <span class="room-value" id="roomType">${room.roomType}</span>
        </div >
        <div class="card-body">
          <img class="room-image" 
          src="images/${this.findRoomImageSource(room)}.jpg" 
          alt="default-room-icon" />
          <div class="card-info">
            Room Number: <span class="room-value" id="number">
              ${room.number}
            </span>
            <br />
            Number of beds: <span class="room-value" id="numBeds">
              ${room.numBeds}
            </span>
            <br />
              Bed Size: <span class="room-value" id="bedSize">
              ${room.bedSize}
            </span>
            <br />
            Bidet: <span class="room-value" id="bidet">
              ${room.bidet ? 'yes' : 'none'} 
            </span>
            <br />
            Cost: <span class="room-value" id="costPerNight">
              $${room.costPerNight}/night
            </span>
            <br />
            <button class="booking-button hidden" tabindex="0" id="${room.number}">
              Book it
            </button>
          </div>
        </div>
      </section >`
  }

  findLoggedInElements() {
    if (this.hotel.currentUser === undefined) {
      this.showElements('#user-bar-signed-out')
      this.hideElements('#user-bar-signed-in')
    } else {
      this.showElements('#user-bar-signed-in', '.booking-button', '.user-pane')
      this.hideElements('#user-bar-signed-out')
      this.placeUserName()
      // let bookingButtons = document.querySelectorAll('.booking-button')
      // bookingButtons.forEach(button => this.showElements(button))
    }
    if (this.hotel.currentUser instanceof Manager) {
      this.showElements('.manager-dash', '.user-search')
      this.hideElements('.guest-dash')
    } else if(this.hotel.currentUser instanceof Customer) {
      this.hideElements('.manager-dash', '.user-search')
      this.showElements('.guest-dash')
    }

  }

  placeUserName() {
    let username = document.getElementById('user-name')
    if (this.hotel.currentUser.name) {
      username.innerText = this.hotel.currentUser.name
    } else {
      username.innerText = 'Manager'
    }
  }

  findRoomImageSource(room) {
    return room.roomType.split(' ').join('-');
  }
}

export default Page