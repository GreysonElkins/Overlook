const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies)

import Page from '../src/Page'
import {events} from "./faux-data";

describe("Page", () => {

  let page
  let mockHelper

  beforeEach(() => {
    global.document = {}
    mockHelper = {}
    Object.prototype.addEventListener = () => {}
    chai.spy.on(mockHelper, ['goToRoomsPage'], () => {})
    chai.spy.on(document, ['querySelectorAll'], () => {
      return ['node', 'node', 'node']
    })
    chai.spy.on(Object.prototype, ['addEventListener'], () => {})
    page = new Page()
  })

  it('should be a function', () => {
    expect(Page).to.be.a('function')
  })

  it('should run findButtons on instantiation', () => {
    expect(document.querySelectorAll).to.have.been.called(1)
  })

  it('should be able to find all buttons', () => {
    page.findButtons()
    expect(document.querySelectorAll).to.have.been.called(2)
    expect(document.querySelectorAll).to.have.been.called.with('button')
  }) 

  it.skip('should place an event listener on each button', () => {
    page.findButtons()
    expect(addEventListener).to.have.been.called(3)

    // fighting against multiple spies or maybe addEventListener 
    // trying to set () => {} as a property of undefined?
  })

  it('should be able to handle an event for a log-in button', () => {
    page.buttonHandler(events.logIn, mockHelper);
    expect(mockHelper.goToRoomsPage).to.have.been.called(1);
  })


});
