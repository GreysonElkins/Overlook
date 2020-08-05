const chai = require("chai")
const expect = chai.expect
const spies = require("chai-spies")
chai.use(spies)


import Hotel from "../src/Hotel"
import DataHandler from '../src/DataHandler'
import { bookings } from './faux-data'

describe("Data Handler", () => {

  let overlook
  let dataHandler
  let mockResponse
  let fauxDataHandler

  beforeEach(() => {
    dataHandler = new DataHandler()
    fauxDataHandler = new DataHandler
    mockResponse = {
      ok: 'value',
      then: (method) => {
        method(mockResponse)
        return mockResponse
      },
      catch: () => {
        return mockResponse
      }
    }
    Object.prototype.json;
    overlook = new Hotel()
    chai.spy.on(global, 'fetch', () => {
      return mockResponse
    })
    chai.spy.on(overlook, 'storeData', () => {})
    chai.spy.on(global, "alert", () => {})
    chai.spy.on(Object.prototype, 'json', () => {})
    chai.spy.on(fauxDataHandler, 'getData', ()=> {})
  })

  afterEach(() => {
    chai.spy.restore()
  })

  describe('GET', () => {
    it('should fetch a specified url', () => {
      dataHandler.getData('users', overlook)
      expect(fetch).to.have.been.called(1)
      expect(fetch).to.have.been.called.with(
        `https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users`
      )
    })

    it('should json the response', () => {
      dataHandler.getData('users', overlook) 
      expect(Object.prototype.json).to.have.been.called(1)
    })

    it('should store data once it fetches', () => {
      dataHandler.getData('rooms', overlook) 
      expect(overlook.storeData).to.have.been.called(1)
      expect(global.json).to.have.been.called(1)
    })
  })

  describe('POST', () => {
    it('should post to the bookings API', () => {
      dataHandler.makeBooking()
      expect(fetch).to.have.been.called(1)
      expect(fetch).to.have.been.called.with(
        'https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings'
      )
    })

    it('should include a header with method, headers, and body', () => {
      dataHandler.makeBooking(bookings[0])
      expect(fetch).to.have.been.called.with({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookings[0])
      })
    })

    it('should alert the user if the post was successfully made', () => {
      dataHandler.makeBooking(bookings[0])
      expect(alert).to.have.been.called(1)
      expect(alert).to.have.been.called.with(
        'Thanks for planning a trip with us, we look forward to your stay!'
      )
    })

    it('should be an error if the response is not ok', () => {
      mockResponse.ok = undefined;
      expect(dataHandler.makeBooking).to.throw('Something went wrong')
    })
  })

  describe('DELETE', () => {
    
    it('should make a fetch request', () => {
      dataHandler.deleteBooking()
      expect(fetch).to.have.been.called(1)
    })

    it('should fetch to the bookings API', () => {
      dataHandler.deleteBooking()
      expect(fetch).to.have.been.called.with(
        `https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings`
      )
    })

    it('should be called with method, headers, and body', () => {
      dataHandler.deleteBooking(bookings[0].id)
      expect(fetch).to.be.called.with({
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "id": bookings[0].id }),
      })
    })

    it('should alert when the response is ok', () => {
      dataHandler.deleteBooking(bookings[0].id)
      expect(alert).to.be.called(1)
      expect(alert).to.be.called.with(
        'This reservation has been successfully removed'
      )
    })

    it('should throw an error if the response is not ok', () => {
      mockResponse.ok = undefined;
      expect(dataHandler.deleteBooking).to.throw('Something went wrong')
    })
  })
})