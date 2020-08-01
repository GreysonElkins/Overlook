const chai = require("chai")
const expect = chai.expect
const spies = require("chai-spies")
chai.use(spies)

import EventHandler from "../src/EventHandler"
import Hotel from "../src/Hotel"

describe("Event Handler", () => {

  let mockPromise
  let responseObject
  let overlook
  beforeEach(() => {
    responseObject = {
      then: () => {
        return responseObject
      },
      catch: () => {
        return responseObject
      }
    }
    global.document = {}
    global.fetch = () => {
      return responseObject
    }
    mockPromise = {}
    overlook = new Hotel();
    chai.spy.on(global, 'fetch')
    // chai.spy.on(fetch, ['then'], () => {})
  })



})