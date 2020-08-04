const chai = require("chai");
const expect = chai.expect;
const spies = require("chai-spies");
chai.use(spies);

import User from '../src/User'

describe('User', () => {
  it('should be a function', () => {
    expect(User).to.be.a('function')
  })

  it('should be able to create a booking object', () => {
    const user = new User()
    const result = user.createBooking(2, '01/01/3000', 1)
    expect(result).to.deep.equal({
      "userID": 1,
      "date": '01/01/3000',
      "roomNumber": 2
    })
  })

  it.skip('this should be expanded to include type restrictions')
})