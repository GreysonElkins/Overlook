const chai = require("chai")
const expect = chai.expect
const spies = require("chai-spies")
chai.use(spies)


import Hotel from "../src/Hotel"
import DataHandler from '../src/DataHandler'

describe("Data Handler", () => {

  let overlook
  let dataHandler
  let mockResponse
  let fauxDataHandler

  beforeEach(() => {
    fauxDataHandler = new DataHandler
    mockResponse = {
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
    dataHandler = new DataHandler()
    chai.spy.on(global, 'fetch', () => {
      return mockResponse
    })
    chai.spy.on(overlook, 'storeData', () => {})
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

    it('should store data once it fetches', () => {
      dataHandler.getData('rooms', overlook) 
      expect(overlook.storeData).to.have.been.called(1)
      expect(global.json).to.have.been.called(1)
    })

    it('should be able to iterate over getData for multiple apis', () => {
      fauxDataHandler.getAllData(overlook, 'users', 'rooms')
      expect(fauxDataHandler.getData).to.have.been.called(2)
    })
  })
})