import Hotel from "./Hotel"


class Page {
  constructor() {
    this.hotel = new Hotel()
  }
  getLogInInfoFromForm() {
    const inputs = document.querySelectorAll('input')
    const userCredentials = {}
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].id === 'username' 
      && !inputs[i].classList.contains('hidden')) {
        userCredentials.username = inputs[i].value
      } else if (inputs[i].id === 'password'
      && !inputs[i].classList.contains('hidden')) {
        userCredentials.password = inputs[i].value
      }
    }
    return userCredentials
  }

  hideElements() {
    const args = Array.from(arguments)
    args.forEach(argument => {
      const element = document.querySelector(argument)
      element.classList.add('hidden')
    })
  }

  showElements() {
    const args = Array.from(arguments)
    args.forEach(argument => {
      const element = document.querySelector(argument)
      element.classList.remove('hidden')
    })
  }

  goToRoomsPage() {
    this.populateRoomCards()
    this.hideElements('.home-page')
    this.showElements('.rooms-page')
  }
  
  populateRoomCards(hotel = this.hotel) {
    hotel.getData('rooms') 
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
          <img class="room-image" src="images/overlook.jpg" 
          alt="default-room-icon" />
          <!-- a function for determining the image src -->
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
            <button tabindex="0" id="${room.number}">
              Book it
            </button>
          </div>
        </div>
      </section >`
  }
}

export default Page