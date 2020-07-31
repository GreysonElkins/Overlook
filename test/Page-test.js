const chai = require("chai");
const expect = chai.expect;
const spies = require("chai-spies");
chai.use(spies);

import Page from '../src/Page'
import {inputNodes} from './faux-data'

describe("Page", () => {
  
  let page;

  beforeEach(() => {
    global.document = {}
    chai.spy.on(document, ["querySelectorAll"], () => {
      return inputNodes;
    })
    page = new Page()
  })

  it('should be a function', () => {
    expect(Page).to.be.a('function')
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