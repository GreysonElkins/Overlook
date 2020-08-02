const chai = require("chai")
const expect = chai.expect
const spies = require("chai-spies")
chai.use(spies)

import Hotel from '../src/Hotel'
import Customer from '../src/Customer'
import Manager from '../src/Manager'
import {users, rooms, bookings, allBooked, junk} from './faux-data'



describe('Hotel', () => {
  
  let overlook;

  beforeEach(() => {
    overlook = new Hotel();
  })

  describe('data storage', () => {

    it('should be a function', () => {
      expect(Hotel).to.be.a('function');
    })
  
    it('should be able to store room data', () => {
      overlook.storeData(rooms)
      expect(overlook.rooms).to.deep.equal(rooms)
    })
  
    it('it should only store data that\'s in an array', () => {
      let response = overlook.storeData(junk.words)
      expect(overlook.rooms).to.equal(undefined)
      expect(response).to.equal('unexpected data type')
    })
  
    it('should be able to discern between room and booking data', () => {
      let response1 = overlook.determineDataCategory(rooms)
      let response2 = overlook.determineDataCategory(bookings)
      let response3 = overlook.determineDataCategory(junk)
      expect(response1).to.equal('rooms');
      expect(response2).to.equal('bookings');
      expect(response3).to.equal('unexpected data type')
    })
  
    it('should be able to store bookings data', () => {
      overlook.storeData(bookings)
      expect(overlook.bookings).to.deep.equal(bookings)
    })

    it('should be able to store user data', () => {
      overlook.storeData(users)
      expect(overlook.users).to.deep.equal(users)
    })
  
    it('should not be able to store other data', () => {
      overlook.storeData(junk.array)
      expect(overlook.bookings).to.equal(undefined)
      expect(overlook.rooms).to.equal(undefined)
    })
  })

  describe('data queries', () => {

    beforeEach(() => {
      overlook.storeData(rooms);
      overlook.storeData(bookings);
    })

    it('can show all rooms available for a given date', () => {
      let expectedResult = [
        rooms[1], 
        rooms[2], 
        rooms[3], 
        rooms[4], 
        rooms[5], 
        rooms[6], 
        rooms[7]
      ]
      let results = overlook.findAvailableRooms("2020/01/27")
      expect(results).to.deep.equal(expectedResult)
    })

    it('should aggressively apologize when all rooms are booked', () => {
      let theRitz = new Hotel()
      theRitz.storeData(allBooked)
      theRitz.storeData(rooms)
      let result = theRitz.findAvailableRooms('2020/04/22')
      expect(result).to.equal('We\'re so sorry but we`re all booked for' + 
      ' that date you\'ll be sorely missed, we hope you\'ll find another' + 
      ' night to join us')
    })

    it('should not check for dates that are formatted wrong', () => {
      let result = overlook.findAvailableRooms('September 4th')
      expect(result).to.equal('The date is an unexpected format')
    })

    it('should be able to filter available rooms by type', () => {
      let expectedResult = [
        rooms[3],
        rooms[4],
        rooms[6],
      ]
      let result = overlook.findAvailableRoomsByType(
        'single room', 
        '2020/01/10'
      )
      expect(result).to.deep.equal(expectedResult)
    })

    it('should apologize if the room type is not available', () => {
      let result = overlook.findAvailableRoomsByType(
        'residential suite',
        '2020/01/27'
      )
      expect(result).to.equal(`We're so sorry but none of the residential` + 
      ` suites are available on that date, please try finding another room`)
    })

    it('should create a list of room numbers booked on a given date', () => {
      let result = overlook.findBookedRoomNumbers('2020/01/10')
      expect(result).to.deep.equal([3, 8])
    })

    it('should be able to find the total revenue for a given date', () => {
      let result = overlook.calculateDailyRevenue('2020/01/10')
      expect(result).to.equal(491.14 + 261.26)
    })
  })  

  describe('user handling', () => {
    beforeEach(() => {
      overlook.storeData(users)
    })

    it('should be able to find a specific user by name', () => {
      let result = overlook.findUser('Greyson Elkins')
      expect(result).to.deep.equal(users[0])
    })

    it('should be able to find a specific user by id', () => {
      let result = overlook.findUser(9)
      expect(result).to.deep.equal(users[8])
    })

    it('should return a message when no user was found', () => {
      let result = overlook.findUser('Waldo')
      expect(result).to.deep.equal('No user was found, ' + 
      'please adjust your search')
    })
  })

  describe('empty data handling', () => {

    let driscoll;

    beforeEach(() => {
      driscoll = new Hotel()
    })

    it('if no data has been stored yet, it should be able say so', () => {
      const result = driscoll.hasData('users')
      expect(result).to.equal(false)
    })
    
    it('if data has been stored, it should be able to say so', () => {
      driscoll.storeData(users)
      const result = driscoll.hasData('users')
      expect(result).to.equal(true)
    })

    it('shouldn\'t find booked room numbers without relevant data', () => {
      const results = driscoll.findBookedRoomNumbers('2020/07/30')
      expect(results).to.equal('This hotel is missing booking data')
    })
    
    it('shouldn\'t find available rooms without relevant data', () => {
      const results = driscoll.findAvailableRooms('2020/07/30')
      expect(results).to.equal('This hotel is missing booking data')
      driscoll.storeData(bookings)
      const results2 = driscoll.findAvailableRooms('2020/07/30')
      expect(results2).to.equal('This hotel is missing room data')
    })

    it('shouldn\'t filter available rooms without relevant data', () => {
      const results = driscoll.findAvailableRoomsByType('suite', '2020/07/30')
      expect(results).to.equal('This hotel is missing booking data')
      driscoll.storeData(bookings)
      const results2 = driscoll.findAvailableRoomsByType('suite', '2020/07/30')
      expect(results2).to.equal('This hotel is missing room data')
    })

    it('shouldn\'t calculate daily revenue without relevant data', () => {
      const results = driscoll.calculateDailyRevenue('2020/07/30')
      expect(results).to.equal('This hotel is missing booking data')
    })

    it('shouldn\'t search for users without relevant data,', () => {
      const results = driscoll.findUser(8)
      expect(results).to.equal('This hotel is missing user data')
    })
  })

  describe('user authentification', () => {
    let hotel;

    beforeEach(() => {
      hotel = new Hotel()
      global.document = {}
      global.fetch = () => {
        return Promise
      }
      Promise = {
        then: () => {
          return Promise
        },
        catch: () => {
          return Promise
        }
      }
      overlook.storeData(users);
      chai.spy.on(global, 'fetch') 
      chai.spy.on(global.fetch, 'then')
      chai.spy.on(hotel, ['checkUserId'], () => {new Customer(users[0])})
    })
    
    it('should allow a manager to log in with the right password', () => {
      const managerCredentials = {username: 'manager', password: 'overlook2020'}
      overlook.authenticateUser(managerCredentials) 
      expect(overlook.currentUser).to.be.an.instanceOf(Manager)
    })

    it('should not allow a manager to log in with the wrong password', () => {
      const managerCredentials = {
        username: 'manager', 
        password: 'overlook2021'
      } 
      let result = overlook.authenticateUser(managerCredentials)
      expect(result).to.equal(undefined)
    })

    it('should be able to find customer\'s id', () => {
      let user = overlook.checkUserId('customer1')
      expect(user).to.deep.equal(new Customer(users[0]))
    })

    it('should allow a client to log in with the correct password' +
    ' and fetch user data', () => {
      const clientCredentials = {
        username: 'customer1',
        password: 'overlook2020'
      }
      overlook.authenticateUser(clientCredentials)
      expect(fetch).to.have.been.called(1)
    })

    it('should only allow users already in the system to log in', () => {
      const clientCredentials = {
        username: 'customer11',
        password: 'overlook2020'
      }
      overlook.authenticateUser(clientCredentials)
      expect(overlook.currentUser).to.equal(undefined)
    })

    // it('should store the current user as a customer upon authenticating ' + 
    // 'a customer', () => {
    //   const clientCredentials = {
    //     username: 'customer1',
    //     password: 'overlook2020'
    //   }
    //   overlook.authenticateUser(clientCredentials)
    //   expect(overlook.currentUser).to.be.an.instanceOf(Customer)
    // })

    it('should create a manager as the currentUser' + 
    'when a manager logs in', () => {
      const managerCredentials = {
        username: 'manager',
        password: 'overlook2020'
      }
      overlook.authenticateUser(managerCredentials)
      expect(overlook.currentUser).to.be.an.instanceOf(Manager)

    })
  })
})