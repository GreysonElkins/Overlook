const chai = require("chai")
const expect = chai.expect
const spies = require("chai-spies")
chai.use(spies)

import EventHandler from "../src/EventHandler"
import Hotel from '../src/Hotel'
import {inputNodes} from './faux-data'

describe("Event Handler", () => {
  let handler;
  let mockHelper;
  let event;

  beforeEach(() => {
    global.document = {}
    mockHelper = {}
    event = {target: {id: 'log-in'}}
    Object.prototype.addEventListener = () => {}
    chai.spy.on(event, 'preventDefault', () => {})
    chai.spy.on(mockHelper, ["goToRoomsPage", "getLogInInfoFromForm"], () => {
      return {username: 'yoPapa', password: 'yoMama'}
    })
    chai.spy.on(document, ["querySelectorAll"], (query) => {
      return ['node', 'node', 'node']
      // if (query === 'buttons') return ['node', 'node', 'node']
    })
    handler = new EventHandler()
    chai.spy.on(handler.hotel, ["authenticateUser"], () => { return true })
    chai.spy.on(Object.prototype, ["addEventListener"], () => {})
  })
  
  describe("Set-up", () => {

    it("should be a function", () => {
      expect(EventHandler).to.be.a("function")
    })
  
    it("should run findButtons on instantiation", () => {
      expect(document.querySelectorAll).to.have.been.called(1)
    })
  
    it('should have a Hotel on instantiating', () => {
      expect(handler.hotel).to.be.an.instanceOf(Hotel)
    })
  
    it("should be able to find all buttons", () => {
      handler.findButtons()
      expect(document.querySelectorAll).to.have.been.called(2)
      expect(document.querySelectorAll).to.have.been.called.with("button")
    })
  
    it.skip("should place an event listener on each button", () => {
      handler.findButtons()
      expect(addEventListener).to.have.been.called(3)
  
      // fighting against multiple spies or maybe addEventListener
      // trying to set () => {} as a property of undefined?
    })
  })
  describe("Login", () => {
    it('should receive log-in info from form', () => {
      handler.buttonHandler(event, mockHelper)
      expect(mockHelper.getLogInInfoFromForm).to.have.been.called(1)
    })
  
    it('shouldn\'t refresh the page when log-in is clicked', () => {
      handler.buttonHandler(event, mockHelper)
      expect(event.preventDefault).to.have.been.called(1)
    })
  
    it('should use the hotel to authenticate the user', () => {
      handler.buttonHandler(event, mockHelper)
      expect(handler.hotel.authenticateUser).to.have.been.called(1)
    })
  
  })
})
