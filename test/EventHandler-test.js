const chai = require("chai")
const expect = chai.expect
const spies = require("chai-spies")
chai.use(spies)

import EventHandler from "../src/EventHandler"

describe("Event Handler", () => {
  let handler;
  let fauxPage;
  let event;
  let roomEvent

  beforeEach(() => {
    global.document = { }
    fauxPage = {hotel: {}}
    event = {target: {id: 'log-in'}}
    roomEvent = {target: {id: 'rooms-button'}}
    Object.prototype.addEventListener = () => {}
    chai.spy.on(event, 'preventDefault', () => {})
    chai.spy.on(fauxPage, ["goToRoomsPage", "getLogInInfoFromForm"], () => {
      return {username: 'yoPapa', password: 'yoMama'}
    })
    chai.spy.on(fauxPage.hotel, ['authenticateUser'], () => {
      fauxPage.hotel.currentUser = "YoPapa"
      return {then: () => {
        if (fauxPage.hotel.currentUser !== undefined) {
          fauxPage.goToRoomsPage();
        }
      }}
    })
    chai.spy.on(document, ["querySelectorAll"], () => {
      return ['node', 'node', 'node']
    })
    handler = new EventHandler()
    chai.spy.on(Object.prototype, ["addEventListener"], () => {})
  })
  
  describe("set-up", () => {

    it("should be a function", () => {
      expect(EventHandler).to.be.a("function")
    })
  
    it("should run findButtons on instantiation", () => {
      expect(document.querySelectorAll).to.have.been.called(1)
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
  describe("login", () => {

    it('should receive log-in info from form', () => {
      handler.buttonHandler(event, fauxPage)
      expect(fauxPage.getLogInInfoFromForm).to.have.been.called(1)
    })
  
    it('shouldn\'t refresh the page when log-in is clicked', () => {
      handler.buttonHandler(event, fauxPage)
      expect(event.preventDefault).to.have.been.called(1)
    })
  
    it('should use the hotel to authenticate the user', () => {
      handler.buttonHandler(event, fauxPage)
      expect(fauxPage.hotel.authenticateUser).to.have.been.called(1)
    })
  
  })
  describe("directing page changes", () => {  
    
    it('should go to rooms page if the user is authenticated', () => {
      handler.buttonHandler(event, fauxPage)
      expect(fauxPage.goToRoomsPage).to.have.been.called(1)
    })

    it('should go to the rooms page when rooms is clicked', () => {
      handler.buttonHandler(roomEvent, fauxPage);
      expect(fauxPage.goToRoomsPage).to.have.been.called(1);
    })
  })
})
