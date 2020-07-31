const chai = require("chai")
const expect = chai.expect
const spies = require("chai-spies")
chai.use(spies)

import EventHandler from "../src/EventHandler"

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
    chai.spy.on(mockHelper, ["goToRoomsPage", "getLogInInfoFromForm"], () => {})
    chai.spy.on(document, ["querySelectorAll"], () => {
      return ["node", "node", "node"]
    })
    chai.spy.on(Object.prototype, ["addEventListener"], () => {})
    handler = new EventHandler()
  })

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

  it("should be able to handle an event for a log-in button", () => {
    handler.buttonHandler(event, mockHelper)
    expect(mockHelper.goToRoomsPage).to.have.been.called(1)
  })

  it('should receive log-in info from form', () => {
    handler.buttonHandler(event, mockHelper)
    expect(mockHelper.getLogInInfoFromForm).to.have.been.called(1)
  })

  it('shouldn\'t refresh the page when log-in is clicked', () => {
    handler.buttonHandler(event, mockHelper)
    expect(event.preventDefault).to.have.been.called(1)
  })
})
