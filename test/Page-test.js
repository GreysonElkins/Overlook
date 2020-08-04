const chai = require("chai");
const expect = chai.expect;
const spies = require("chai-spies");
chai.use(spies);

import page from '../src/Page'
import Hotel from '../src/Hotel'
import Manager from '../src/Manager'
import Customer from '../src/Customer'
import { inputNodes, users, rooms, bookings, mockResponse } from './faux-data'

describe("Page", () => {

  page.hotel.storeData(users)
  page.hotel.storeData(rooms)
  page.hotel.storeData(bookings)

  beforeEach(() => {
    global.document = {}
    chai.spy.on(document, ['querySelectorAll'], () => {
      return inputNodes;
    })
    chai.spy.on(document, ['getElementById', 'querySelector'], () => {
      return {innerHtml: 'whatever'}
    })
    chai.spy.on(Object.prototype, 'insertAdjacentHTML', () => {})
    chai.spy.on(Promise, 'all', () => mockResponse)
    chai.spy.on(page.hotel, 'getData', () => {
      return {then: (method) => { method()}}
    })
    chai.spy.on(page.hotel, 'findAvailableRooms', () => rooms)
    chai.spy.on(page, [
      'roomCardTemplate', 
      'hideElements', 
      'showElements'
    ], () => {})
  })

  afterEach(() => {
    chai.spy.restore()
  })

  it('should be an object', () => {
    expect(page).to.be.an('object')
  })

  it('should have a hotel', () => {
    expect(page.hotel).to.be.an.instanceof(Hotel)
  })

  describe('log in elements', () => {

    it('should start with an undefined currentUser', () => {
      expect(page.currentUser).to.equal(undefined)
    })
  
    it('should be able to find inputs', () => {
      page.getLogInInfoFromForm();
      expect(document.querySelectorAll).to.have.been.called(1)
      expect(document.querySelectorAll).to.have.been.called.with('input')
    })

    it('should return username/password as a useable object', () => {
      const userCredentials = page.getLogInInfoFromForm();
      expect(userCredentials).to.deep.equal({
        username: 'yoPapa',
        password: 'yoMama'
      })
    })
  }) 

  describe('room cards', () => {

    let fauxHotel = {};

    beforeEach(() => {
      fauxHotel = new Hotel();
      fauxHotel.rooms = rooms

    })

    it('should get fresh booking and room data for its hotel' + 
    'before populating room cards', () => {
      page.populateRoomCards()
      expect(page.hotel.getData).to.have.been.called(2)
      expect(page.hotel.getData).to.have.been.called.with('bookings')
      expect(page.hotel.getData).to.have.been.called.with('rooms')
    })

    it('should populate cards after a Promise.all resolves', () => {
      page.populateRoomCards()
      expect(Promise.all).to.have.been.called(1)
    })

    it('should find available rooms if rooms haven\'t been specified', () => {
      page.populateRoomCards()
      expect(page.hotel.findAvailableRooms).to.have.been.called(1)
    })

    it('should find the card-container where to put room cards', () => {
      page.populateRoomCards()
      expect(document.getElementById).to.have.been.called(1)
      expect(document.getElementById).to.have.been.called.with('card-container')
    })

    it('should insertAdjacentHtml for every room' + 
    'with html created by roomCardTemplate', () => {
      page.populateRoomCards()
      expect(Object.prototype.insertAdjacentHTML).to.have.been.called(8)
      expect(page.roomCardTemplate).to.have.been.called(8)
    }) 
  })

  describe('changing pages', () => {

    it('should hide the home page when going to rooms page', () => {
      page.goToRoomsPage(rooms)
      expect(page.hideElements).to.have.been.called.with('.home-page')
    })

    it('should show the rooms page when going to it', () => {
      page.goToRoomsPage(rooms)
      expect(page.showElements).to.have.been.called.with('.rooms-page')
    })

    it('should show the signed-out user bar' +
    'if current user is undefined', () => {
      page.findLoggedInElements()
      expect(page.showElements).to.have.been.called(1)
      expect(page.showElements).to.have.been.called.with(
        '#user-bar-signed-out'
      )
    })

    it('should show the signed-in user bar and booking buttons' +
    ' if the user is defined', () => {
      page.currentUser = "Danny Torrence"
      page.findLoggedInElements()
      expect(page.showElements).to.have.been.called(1)
      expect(page.showElements).to.have.been.called.with('.booking-button')
      expect(page.showElements).to.have.been.called.with('#user-bar-signed-in')
    })

    it('should show the user-pane if the user is defined', () => {
      page.currentUser = "Danny Torrence"
      page.findLoggedInElements()
      expect(page.showElements).to.have.been.called(1)
      expect(page.showElements).to.have.been.called.with(
        '.user-pane'
      )
    })    
  })

  describe('user dashboards', () => {
    
    beforeEach(() => {
      page.currentUser = new Customer(users[0])
      chai.spy.on(page.hotel, [
        'calculateDailyRevenue', 
        'findAvailableRoomsByWhatever'
      ], () => {})
      chai.spy.on(page.currentUser, [
        'findBookings',
        'findAccountBalance'
      ], () => {})
      chai.spy.on(page, ['populateUserBookingLists', 'goToRoomsPage'], () => {})
    })

    it('should select a specific dashboard node when populating', () => {
      page.populateDashboard('.manager-info')
      expect(document.querySelector).to.have.been.called(1)
      expect(document.querySelector).to.have.been.called.with('.manager-info')
    })

    it('should certain calculations based if a user is a Manager', () => {
      page.currentUser = new Manager()
      page.getUserDashboardData()
      expect(page.hotel.findAvailableRooms).to.have.been.called(2)
      expect(page.hotel.calculateDailyRevenue).to.have.been.called(1)
    })

    it('should run other calculations if a user is a Customer', () => {
      page.getUserDashboardData()
      expect(page.currentUser.findBookings).to.have.been.called(1)
      expect(page.currentUser.findAccountBalance).to.have.been.called(1)
      expect(page.populateUserBookingLists).to.have.been.called(2)
    })

    it('should be able to see room tags', () => {
      page.addTagListeners()
      expect(document.querySelectorAll).to.have.been.called(1)
    })

    it('should be able to check which tags are selected after fetching', () => {
      page.checkTags()
      expect(page.hotel.getData).to.have.been.called
      expect(Promise.all).to.have.been.called
    })

    it('should be able to find available rooms based on selected tags', () => {
      page.checkTags()
      expect(page.hotel.findAvailableRoomsByWhatever).to.have.been.called(1)
      expect(page.goToRoomsPage).to.have.been.called(1)
    })

    beforeEach(() => {
      chai.spy.on(page, ['getDateInQuestion', 'getSelectedTags'], () => {})
    })

    it('should pull data from each of the filter categories', () => {
      page.checkTags()
      expect(page.getDateInQuestion).to.have.been.called(1)
      expect(page.getSelectedTags).to.have.been.called(2)
      expect(document.getElementById).to.have.been.called(2)
    })
  })

  describe('booking', () => {
    
    let event

    beforeEach(() => {
      event = { target: { id: `submit -user1`}}
      chai.spy.on(page, ['getDateInQuestion', 'getSelectedTags'], () => { })
      chai.spy.on(page.currentUser, 'createBooking', () => {})
      chai.spy.on(page.hotel, 'makeBooking', () => {})
      chai.spy.on(page.hotel, 'findUser', () => users[0])
      chai.spy.on(page, [
        'sortBookingsByDate', 
        'populateBookingCards'
      ], () => users[0].bookings)
    })

    it('should share/send booking from the user for creation and then the ' +
    'hotel for posting', () => {
      page.findCustomerBookingData(event)  
      expect(page.getDateInQuestion).to.have.been.called(1)
      expect(page.currentUser.createBooking).to.have.been.called(1)
      expect(page.hotel.makeBooking).to.have.been.called(1)
    })

    it('should find booking data for a manager who has provided an id', () =>{
      page.findManagerBookingData()
      expect(page.getDateInQuestion).to.have.been.called(1)
      expect(page.currentUser.createBooking).to.have.been.called(1)
      expect(page.hotel.makeBooking).to.have.been.called(1)
    })

    it('should be able to pull out an id from an event id find a user' + 
    'after fetching users', () => {
      page.setUserToBook(event)
      expect(page.hotel.getData).to.have.been.called(1)
      expect(page.hotel.getData).to.have.been.called.with('users')
      expect(document.getElementById).to.have.been.called(1)
      expect(page.hotel.findUser).to.have.been.called(1)
    })
    
    it('should remove the booking pop-up if a user is found', () => {
      page.setUserToBook(event)
      expect(page.hideElements).to.have.been.called(1)
    })

    it('should be able to find a user to search for in an input field', () => {
      page.searchForBookings()
      expect(document.getElementById).to.have.been.called(1)
      expect(document.getElementById).to.have.been.called.with(
        'user-booking-query'
      )
    })

    it('should be able to find a user and fetch data when it succeeds', () => {
      page.searchForBookings()
      expect(page.hotel.findUser).to.have.been.called(1)
      expect(page.hotel.getData).to.have.been.called(2)
    })

    it('should wait for that data and then hide,' + 
    'show and populate elements accordingly', () => {
      page.searchForBookings()
      expect(Promise.all).to.have.been.called(1)
      expect(page.hideElements).to.have.been.called(1)
      expect(page.hideElements).to.have.been.called.with('#rooms-page')
      expect(page.showElements).to.have.been.called(1)
      expect(page.showElements).to.have.been.called.with('#search-results')
      expect(page.populateBookingCards).to.have.been.called(1)
    })
  }) 
})