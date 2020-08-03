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


  
  populateRoomCards(rooms) {
    let promise1 = this.hotel.getData('bookings')
    let promise2 = this.hotel.getData('rooms')
    
    return Promise.all([promise1, promise2]) 
      .then(() => {
        if (rooms === undefined) {
          rooms = this.hotel.findAvailableRooms()
        }
        const container = document.getElementById('card-container')
        container.innerHTML = ''
        rooms.forEach(room => {
          container.insertAdjacentHTML('beforeend', this.roomCardTemplate(room))
        })

      })
    
    // return this.hotel.getData('rooms') 
    //   .then(() => {
    //     })
    //   })
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
    const dashboard = document.querySelector(dash)
    const roomTags = document.getElementById('filter-rooms')
    const bedTags = document.getElementById('filter-beds')

    const promise1 = this.hotel.getData('rooms')
    const promise2 = this.hotel.getData('bookings')
    let userHtml;
    let roomTagHtml;
    let bedTagHtml;

    Promise.resolve(promise1)
      .then(() => {
        roomTagHtml = this.populateRoomTags('roomType')
        bedTagHtml = this.populateRoomTags('bedSize')
        roomTags.innerHTML = roomTagHtml
        bedTags.innerHTML = bedTagHtml
        this.addTagListeners()
      })

    Promise.all([promise1, promise2])
      .then(() => {
        userHtml = this.getUserDashboardData()
        dashboard.innerHTML = userHtml
      })
  }

  getUserDashboardData() {
    const date = new Date(this.hotel.today) 
    const printDate = moment(date).format('MMM DD')

    if (this.hotel.currentUser instanceof Manager) {
      return `
      <h3tabindex="0">Manager Dashboard</h3><br />
      Rooms available for <date>$${printDate}</date>: 
      <span id="roomsAvailable" tabindex="0">
        ${this.hotel.findAvailableRooms().length}
      </span><br />
      Revenue on <date>$${printDate}</date>: 
      <span id="revenue" tabindex="0">
        $${this.hotel.calculateDailyRevenue()}
      </span><br />
      Percentage of rooms occupied on <date>$${printDate}</date>:
      <span id="percentageBooked" tabindex="0">
      ${((this.hotel.rooms.length - this.hotel.findAvailableRooms().length) /
        this.hotel.rooms.length) *
        100}%
      </span>`;
    } else if (this.hotel.currentUser instanceof Customer) {
      const user = this.hotel.currentUser
      user.bookings = user.findBookings(this.hotel.bookings)
      user.accountBalance = user.findAccountBalance(this.hotel.rooms)
      return `
      <hr>
      <h3 tabindex="0">Guest Dashboard</h3>
      Account Balance: <span id="accountBalance" tabindex="0">
        $${user.accountBalance}
      </span><br >
      Up-coming Visits: <ul id="upcoming-visits" tabindex="0">
        ${this.populateUserBookingLists("upcoming")}
      </ul><br />
      Previous Visits: <ul id="previous-visits" tabindex="0">
        ${this.populateUserBookingLists("previous")}
      </ul>
      `;
    }
  }
  
  populateUserBookingLists(list) {
    return this.hotel.currentUser.bookings.reduce((listItems, booking) => {
      let date = new Date(booking.date)
      let item = `<li tabindex="0">${moment(date).format("DD MMM YYYY")}</li>`;
      if (list === 'upcoming' && moment(date) >= moment()) {
        listItems += item
      } else if (list === 'previous' && moment(date) < moment()) {
        listItems += item
      }
      return listItems
    }, '')
  }

  findRoomImageSource(room) {
    return room.roomType.split(' ').join('-');
  }

  displayPriceFilterSliderValue() {
    const slider = document.getElementById('max-price');
    const display = document.getElementById('slider-value')
    display.innerText = slider.value;

    slider.oninput = function() {
      display.innerText = this.value; 
    }
  }

  populateRoomTags(key) {
    let roomTags = []
    return this.hotel.rooms.reduce((roomTagsHtml, room) => {
      if (!roomTags.includes(room[key])) {
        roomTags.push(room[key])
        roomTagsHtml += `
        <button class="room-tag" id="${key}">${room[key]}</button>`
      }
      return roomTagsHtml
    }, '')
  }

  addTagListeners() {
    const tags = document.querySelectorAll('.room-tag')
    for (let i = 0; i < tags.length; i ++) {
      tags[i].addEventListener('click', this.toggleTagState)
    }
  }
 
  toggleTagState(event) {
    let tag = event.target
    if (tag.classList.contains('selected')) {
      tag.classList.remove('selected')
      tag.style.backgroundColor = "#4E241E"
    } else {
      tag.classList.add('selected')
      tag.style.backgroundColor = "#283D3B"
    }
  }

  checkTags() {
    let promise1 = this.hotel.getData('bookings')
    let promise2 = this.hotel.getData('rooms')
    
    const dateInQuestion = this.getDateInQuestion() 
    const selectedRoomTags = this.getSelectedTags('#roomType')
    const selectedBedTags = this.getSelectedTags('#bedSize')
    const numberOfBeds = document.getElementById('number-beds').value
    const wantsBidet = document.getElementById('select-bidet').checked

    Promise.all([promise1, promise2])
      .then(() => {
        let filteredRooms = this.hotel.findAvailableRoomsByWhatever(
          dateInQuestion, 
          selectedRoomTags, 
          selectedBedTags, 
          numberOfBeds, 
          wantsBidet
        ) 
        this.populateRoomCards(filteredRooms)
      })

  } 

  getSelectedTags(dataType) {
    const roomTags = document.querySelectorAll(dataType)
    const selectedTags = []
    roomTags.forEach(tag => {
      if (tag.classList.contains('selected')) {
        let value = tag.innerText
        selectedTags.push(value)
      }
    })
    return selectedTags
  } 

  getDateInQuestion() {
    const input = document.getElementById('date-in-question').value
    if (input === "") {
      return this.hotel.today
    } else {
      let unformattedDate = new Date(input)
      const dateInQuestion = moment(unformattedDate).format('YYYY/MM/DD')
      return dateInQuestion
    }
  }

  findBookingData(event) {
    const date = this.getDateInQuestion()
    let booking = this.hotel.currentUser.createBooking(event, date)
    this.hotel.makeBooking(booking)
  }

}

export default Page