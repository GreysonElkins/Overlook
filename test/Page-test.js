const chai = require("chai");
const expect = chai.expect;
const spies = require("chai-spies");
chai.use(spies);

import Page from '../src/Page'
import Hotel from '../src/Hotel'
import {users, rooms, bookings, inputNodes} from './faux-data'
import Manager from '../src/Manager';
import Customer from '../src/Customer';

describe("Page", () => {
  
  let page
  let fauxNode
  let fauxPage
  let fauxHotel
  let mockResponse

  beforeEach(() => {
    //MOCK DOCUMENT
    global.document = {}
    chai.spy.on(document, ['querySelectorAll'], () => {
      return inputNodes;
    })
    chai.spy.on(document, ['querySelector'], () => {
      return fauxNode
    })
    chai.spy.on(document, ['getElementById'], () => {
      return {innerHtml: 'whatever'}
    })
    //MOCK FETCH
    mockResponse = {
      then: (method) => {
        method(mockResponse);
        return mockResponse;
      },
      catch: () => {
        return mockResponse;
      },
      all: () => mockResponse,
    }
    //MOCK
    fauxNode = {
      classList: {
        add: () => {},
        remove: () => {}
      }
    }
    chai.spy.on(fauxNode.classList, ['add', 'remove'], () => {})
    //MOCK HOTEL
    fauxHotel = {rooms}
    chai.spy.on(fauxHotel, 'getData', () => {
      return {
        then: () => {
          const container = document.getElementById("card-container");
          fauxHotel.rooms.forEach((room) => {
            container.insertAdjacentHTML(
              "beforeend", page.roomCardTemplate(room)
            )
          })
        } 
      }
    })
    //MOCK PAGE
    fauxPage = new Page()
    chai.spy.on(fauxPage, [
      'showElements', 
      'hideElements', 
    ], () => {})
    chai.spy.on(fauxPage, 'populateRoomCards', () => mockResponse)
    //PAGE
    page = new Page()
    chai.spy.on(page, ['roomCardTemplate'], () => {
      return `html block`
    })
    //AdjacentHTML as a function
    Object.prototype.insertAdjacentHTML = () => {};
  })

  describe('log-in functions', () => {

    it('should be a function', () => {
      expect(Page).to.be.a('function')
    })

    it('should have a Hotel on instantiating', () => {
      expect(page.hotel).to.be.an.instanceOf(Hotel)
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
  
    it('should not return usernames/passwords from hidden elements', () => {
      const userCredentials = page.getLogInInfoFromForm();
      expect(userCredentials).to.deep.equal({
        username: "yoPapa",
        password: "yoMama",
      });
    })
  })

  describe('room cards', () => {

    it('should insert room cards for every room provided', () => {
      page.populateRoomCards(fauxHotel)
      expect(document.getElementById).to.have.been.called(1)
      expect(document.getElementById).to.have.been.called.with('card-container')
      // expect(Object.prototype.insertAdjacentHTML).to.have.been.called(8)
      expect(page.roomCardTemplate).to.have.been.called(8)
    })

    it('should populate cards when it goes to room page', () => {
      fauxPage.goToRoomsPage(rooms)
      expect(fauxPage.populateRoomCards).to.have.been.called(1)
    })
  })

  describe('changing pages', () => {

    beforeEach(() => {
      Promise = { all: () => mockResponse }
      chai.spy.on(fauxPage.hotel, 'getData', () => mockResponse)
      fauxPage.hotel.storeData(users);
      fauxPage.hotel.storeData(bookings);
      fauxPage.hotel.storeData(rooms);
    })

    it('should be able to hide any amount of elements', () => {
      page.hideElements('1', '2', '3')
      expect(document.querySelectorAll).to.have.been.called(3)
      page.hideElements('1', '2', '3', '4')
      expect(document.querySelectorAll).to.have.been.called(7)
      // expect(fauxNode.classList.add).to.have.been.called(7)
      // expect(fauxNode.classList.add).to.have.been.with('hidden')
    })

    it('should be able to show any amount of elements', () => {
      page.showElements('1', '2', '3')
      expect(document.querySelectorAll).to.have.been.called(3)
      page.showElements('1', '2', '3', '4')
      expect(document.querySelectorAll).to.have.been.called(7)
      // expect(fauxNode.classList.remove).to.have.been.called(7)
      // expect(fauxNode.classList.remove).to.have.been.with('hidden')
    })

    it('should hide the home page when going to rooms page', () => {
      fauxPage.goToRoomsPage(rooms)
      expect(fauxPage.hideElements).to.have.been.called(2)
      expect(fauxPage.hideElements).to.have.been.called.with('.home-page')
    })

    it('should show the rooms page when going to it', () => {
      fauxPage.goToRoomsPage(rooms)
      expect(fauxPage.showElements).to.have.been.called(2)
    })

    it('should show the signed-out user bar' + 
    'if current user is undefined', () => {
      fauxPage.findLoggedInElements()
      expect(fauxPage.showElements).to.have.been.called(1)
      expect(fauxPage.showElements).to.have.been.called.with(
        '#user-bar-signed-out'
      )
    })
    
    it('should show the signed-in user bar and booking buttons' + 
    ' if the user is defined', () => {
      fauxPage.hotel.currentUser = "Danny Torrence"     
      fauxPage.findLoggedInElements()
      expect(fauxPage.showElements).to.have.been.called(1)
      expect(fauxPage.showElements).to.have.been.called.with(
        '#user-bar-signed-in', '.booking-button'
      )
    })
      
    it('should show the user-pane if the user is defined', () => {
      fauxPage.hotel.currentUser = "Danny Torrence"     
      fauxPage.findLoggedInElements()
      expect(fauxPage.showElements).to.have.been.called(1)
      expect(fauxPage.showElements).to.have.been.called.with(
        '.user-pane'
      )
    })

    it('should show the manager-dash / search bar if the user is a manager' + 
    ` and hide the guest-dash`, () => {
      fauxPage.hotel.currentUser = new Manager()
      fauxPage.findLoggedInElements()
      expect(fauxPage.showElements).to.have.been.called(2)
      expect(fauxPage.showElements).to.have.been.called.with(
        '.manager-dash', '.user-search'
      )
      expect(fauxPage.hideElements).to.have.been.called(2)
      expect(fauxPage.hideElements).to.have.been.called.with('.guest-dash')
    })

    it('should show the guest-dash / hide the search bar and manager dash' + 
    ' if the user is a customer', () => {
      fauxPage.hotel.currentUser = new Customer(users[0]) 
      fauxPage.findLoggedInElements();
      expect(fauxPage.hideElements).to.have.been.called(2);
      expect(fauxPage.hideElements).to.have.been.called.with(
        ".manager-dash",
        ".user-search"
      );
      expect(fauxPage.showElements).to.have.been.called(2);
      expect(fauxPage.showElements).to.have.been.called.with(
        ".guest-dash"
      );
    })
  })

  describe('user dashboards', () => {

    beforeEach(() => {
      chai.spy.on(fauxPage.hotel, "getData", () => mockResponse)
      chai.spy.on(fauxPage, 'getDashboardHtml', () => {})
      // chai.spy.on(page.hotel, ['findAvailableRooms', 'calculateDailyRevenue'])
      // chai.spy.on(page.hotel.currentUser, ['findBookings', 'findAccountBalance'])
      // chai.spy.on(page, 'populateUserBookingLists')
      // chai.spy.on(Object.prototype, 'innerHTML', () => {})
    })

    it('should select a specific dashboard node', () => {
      fauxPage.populateUserDashboardData('.manager-info')
      expect(document.querySelector).to.have.been.called(1)
      expect(document.querySelector).to.have.been.called.with('.manager-info')
    })

    it.skip('should get dashboard html and place it', () => {
      fauxPage.populateUserDashboardData(".manager-info");
      expect(fauxPage.getDashboardHtml).to.have.been.called(1)
      // expect(Object.prototype.innerHtml).to.have.been.called(1)
    })

    it.skip('should run calculations based on whether a user is a Manager or Customer', () => {
      page.hotel.currentUser = new Manager() 
      console.log(page.hotel.currentUser)
      page.getDashboardHtml()
      expect(page.hotel.findAvailableRooms).to.have.been.run(2)
      expect(page.hotel.calculateDailyRevenue).to.have.been.run(1)
      expect(page.hotel.currentUser.findBookings).to.have.been.run(0)
      expect(page.hotel.currentUser.findAccountBalance).to.have.been.run(0)
      expect(page.populateUserBookingLists).to.have.been.run(0)
    })

  })
})