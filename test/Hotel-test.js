import 'chai'
import Hotel from '../src/Hotel'
import {rooms, bookings, allBooked, junk} from './faux-data'
import { expect } from 'chai'

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
})