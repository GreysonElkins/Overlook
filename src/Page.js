import Hotel from "./Hotel"
import Manager from "./Manager"
import Customer from "./Customer"
import moment from "moment"

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
    })
  }

  showElements() {
    const args = Array.from(arguments)
    args.forEach(argument => {
      const element = document.querySelectorAll(argument)
      element.forEach((thing) => thing.classList.remove("hidden"));  
    })
  }

  goToRoomsPage() {
    this.populateRoomCards() 
      .then(() => this.findLoggedInElements())
    this.hideElements('.home-page', '.sign-in-pop-up')
    this.showElements('.rooms-page', '.sign-in-or-out')
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
            <button class="booking-button hidden" 
            tabindex="0" id="${room.number}">
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
    }
    if (this.hotel.currentUser instanceof Manager) {
      this.showElements('.manager-dash', '.user-search')
      this.hideElements('.guest-dash')
      this.populateDashboard('.manager-info')
    } else if (this.hotel.currentUser instanceof Customer) {
      this.hideElements('.manager-dash', '.user-search')
      this.showElements('.guest-dash')
      this.populateDashboard('.guest-dash')
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

  populateDashboard(dash) {
    this.populateUserSection(dash)
  }

  populateUserSection(dash) {
    const dashboard = document.querySelector(dash)
    const promise1 = this.hotel.getData('rooms')
    const promise2 = this.hotel.getData('bookings')
    let html;

    Promise.all([promise1, promise2])
      .then(() => {
        html = this.getDashboardHtml()
        dashboard.innerHTML = html 
      })
  }

  getDashboardHtml() {
    const date = moment(this.hotel.today).format('MMM DD')

    if (this.hotel.currentUser instanceof Manager) {
      return `
      <h3>Manager Dashboard</h3>
      Rooms available for <date>${date}</date>: 
      <span id="roomsAvailable">
        ${this.hotel.findAvailableRooms().length}
      </span><br />
      Revenue on <date>${date}</date>: 
      <span id="revenue">$${this.hotel.calculateDailyRevenue()}</span><br />
      Percentage of rooms occupied on <date>${date}</date>:
      <span id="percentageBooked">
      ${(this.hotel.rooms.length - this.hotel.findAvailableRooms().length)
        / this.hotel.rooms.length 
        * 100}%
      </span>`;
    } else if (this.hotel.currentUser instanceof Customer) {
      const user = this.hotel.currentUser
      user.bookings = user.findBookings(this.hotel.bookings)
      user.accountBalance = user.findAccountBalance(this.hotel.rooms)
      console.log(user)
      return `
      <hr>
      <h3>Guest Dashboard</h3>
      Account Balance: <span id="accountBalance">
        $${user.accountBalance}
      </span><br >
      Up-coming Visits: <ul id="upcoming-visits">
        ${this.populateUserBookingLists('upcoming')}
      </ul><br />
      Previous Visits: <ul id="previous-visits">
        ${this.populateUserBookingLists('previous')}
      </ul>
      `;
    }
  }
  
  populateUserBookingLists(list) {
    return this.hotel.currentUser.bookings.reduce((listItems, booking) => {
      let item = `<li>${moment(booking.date).format('DD MMM YYYY')}</li>`;
      if (list === 'upcoming' && moment(booking.date) >= moment()) {
        listItems += item
      } else if (list === 'previous' && moment(booking.date) < moment()) {
        listItems += item
      }
      return listItems
    }, '')
  }

  findRoomImageSource(room) {
    return room.roomType.split(' ').join('-');
  }
}

export default Page