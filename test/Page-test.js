const chai = require("chai");
const expect = chai.expect;
const spies = require("chai-spies");
chai.use(spies);

import Page from '../src/Page'
import Hotel from '../src/Hotel'
import {rooms, inputNodes} from './faux-data'

describe("Page", () => {
  
  let page;
  let fauxNode;
  let fauxPage;
  let fauxHotel;

  beforeEach(() => {
    fauxHotel = {rooms: rooms}
    global.document = {}
    fauxNode = {
      classList: {
        add: () => {},
        remove: () => {}
      }
    }
    global.fetch = () => { Promise }
    chai.spy.on(fauxHotel, 'getData', () => {
      return {
        then: () => {
          const container = document.getElementById("card-container");
          fauxHotel.rooms.forEach((room) => {
            container.insertAdjacentHTML("beforeend", page.roomCardTemplate(room));
          })
        } 
      }
    })
    Object.prototype.insertAdjacentHTML = () => {};
    chai.spy.on(document, ['querySelectorAll'], () => {
      return inputNodes;
    })
    chai.spy.on(document, ['querySelector'], () => {
      return fauxNode
    })
    chai.spy.on(document, ['getElementById'], () => {
      return {innerHtml: 'whatever'}
    })
    chai.spy.on(fauxNode.classList, ['add', 'remove'], () => {})
    page = new Page()
    fauxPage = new Page()
    chai.spy.on(page, ['roomCardTemplate'], () => {
      return `html block`
    })
    chai.spy.on(fauxPage, [
      'showElements', 
      'hideElements', 
      'populateRoomCards'
    ], () => {})
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

    it('should be able to hide any amount of elements', () => {
      page.hideElements('1', '2', '3')
      expect(document.querySelector).to.have.been.called(3)
      page.hideElements('1', '2', '3', '4')
      expect(document.querySelector).to.have.been.called(7)
      expect(fauxNode.classList.add).to.have.been.called(7)
      expect(fauxNode.classList.add).to.have.been.with('hidden')
    })

    it('should be able to show any amount of elements', () => {
      page.showElements('1', '2', '3')
      expect(document.querySelector).to.have.been.called(3)
      page.showElements('1', '2', '3', '4')
      expect(document.querySelector).to.have.been.called(7)
      expect(fauxNode.classList.remove).to.have.been.called(7)
      expect(fauxNode.classList.remove).to.have.been.with('hidden')
    })

    it('should hide the home page when going to rooms page', () => {
      fauxPage.goToRoomsPage(rooms)
      expect(fauxPage.hideElements).to.have.been.called(1)
      expect(fauxPage.hideElements).to.have.been.called.with('.home-page')
    })

    it('should show the rooms page when going to it', () => {
      fauxPage.goToRoomsPage(rooms)
      expect(fauxPage.showElements).to.have.been.called(1)
    })
  })
})