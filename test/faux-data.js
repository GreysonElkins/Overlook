const users = [
  {
    "id": 1, 
    "name": 'Greyson Elkins'
  },  {
    "id": 2,
    "name": 'Josh Sevy'
  },  {
    "id": 3,
    "name": 'Nick Hart'
  },  {
    "id": 4,
    "name": 'Aaron DB'
  }, {
    "id": 5,
    "name": 'Leigh Larson'
  }, {
    "id": 6, 
    "name": 'Bob Gu'
  },  {
    "id": 7, 
    "name": 'Will Mitchel'
  }, {
    "id": 8,
    "name": 'Your mom'
  }, {
    "id": 9,
    "name": 'Mike Viola'
  },
  {
    "id": 10,
    "name": 'Marschall McCluhan'
  }
]

const rooms =  [
  {
    "number": 1,
    "roomType": "residential suite",
    "bidet": true,
    "bedSize": "queen",
    "numBeds": 1,
    "costPerNight": 358.4
  },  {
    "number": 2,
    "roomType": "suite",
    "bidet": false,
    "bedSize": "full",
    "numBeds": 2,
    "costPerNight": 477.38
  },  {
    "number": 3,
    "roomType": "single room",
    "bidet": false,
    "bedSize": "king",
    "numBeds": 1,
    "costPerNight": 491.14
  },  {
    "number": 4,
    "roomType": "single room",
    "bidet": false,
    "bedSize": "queen",
    "numBeds": 1,
    "costPerNight": 429.44
  },  {
    "number": 5,
    "roomType": "single room",
    "bidet": true,
    "bedSize": "queen",
    "numBeds": 2,
    "costPerNight": 340.17
  },  {
    "number": 6,
    "roomType": "junior suite",
    "bidet": true,
    "bedSize": "queen",
    "numBeds": 1,
    "costPerNight": 397.02
  },  {
    "number": 7,
    "roomType": "single room",
    "bidet": false,
    "bedSize": "queen",
    "numBeds": 2,
    "costPerNight": 231.46
  },  {
    "number": 8,
    "roomType": "junior suite",
    "bidet": false,
    "bedSize": "king",
    "numBeds": 1,
    "costPerNight": 261.26
  }
]

const bookings = [
  {
    "id": "5fwrgu4i7k55hl6sz",
    "userID": 9,
    "date": "2020/04/22",
    "roomNumber": 1,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6t5",
    "userID": 10,
    "date": "2020/01/24",
    "roomNumber": 2,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6t6",
    "userID": 1,
    "date": "2020/01/10",
    "roomNumber": 3,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6t7",
    "userID": 2,
    "date": "2020/02/16",
    "roomNumber": 7,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6t8",
    "userID": 3,
    "date": "2020/02/05",
    "roomNumber": 4,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6t9",
    "userID": 5,
    "date": "2020/02/14",
    "roomNumber": 6,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6ta",
    "userID": 7,
    "date": "2020/01/11",
    "roomNumber": 8,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6tb",
    "userID": 9,
    "date": "2020/02/06",
    "roomNumber": 1,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6tc",
    "userID": 10,
    "date": "2020/01/30",
    "roomNumber": 2,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6td",
    "userID": 1,
    "date": "2020/01/31",
    "roomNumber": 3,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6te",
    "userID": 2,
    "date": "2020/01/19",
    "roomNumber": 8,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6tf",
    "userID": 3,
    "date": "2020/01/25",
    "roomNumber": 2,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6tg",
    "userID": 4,
    "date": "2020/02/03",
    "roomNumber": 4,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6th",
    "userID": 5,
    "date": "2020/02/26",
    "roomNumber": 5,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6ti",
    "userID": 6,
    "date": "2020/01/22",
    "roomNumber": 7,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6tj",
    "userID": 7,
    "date": "2020/01/17",
    "roomNumber": 8,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6tk",
    "userID": 7,
    "date": "2020/01/27",
    "roomNumber": 1,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6tl",
    "userID": 3,
    "date": "2020/01/10",
    "roomNumber": 8,
    "roomServiceCharges": []
  },
]

const allBooked = [
  {
    "id": "5fwrgu4i7k55hl6sz",
    "userID": 9,
    "date": "2020/04/22",
    "roomNumber": 1,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6sz",
    "userID": 9,
    "date": "2020/04/22",
    "roomNumber": 2,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6sz",
    "userID": 9,
    "date": "2020/04/22",
    "roomNumber": 3,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6sz",
    "userID": 9,
    "date": "2020/04/22",
    "roomNumber": 4,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6sz",
    "userID": 9,
    "date": "2020/04/22",
    "roomNumber": 5,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6sz",
    "userID": 9,
    "date": "2020/04/22",
    "roomNumber": 6,
    "roomServiceCharges": []
  },  {
    "id": "5fwrgu4i7k55hl6sz",
    "userID": 9,
    "date": "2020/04/22",
    "roomNumber": 7,
    "roomServiceCharges": []
  }, {
    "id": "5fwrgu4i7k55hl6sz",
    "userID": 9,
    "date": "2020/04/22",
    "roomNumber": 8,
    "roomServiceCharges": []
  }
]

const junk = {
  words: "this is trash and fodder",
  array: [{id: 1}, {id: 2}, {id: 3}]
}

const inputNodes = [
  {
    id: "username",
    value: "yoPapa",
    classList: {
      contains: (query) => {
        let list = "";
        return list.includes(query) ? true : false;
      },
    },
  }, {
    id: "password",
    value: "yoMama",
    classList: {
      contains: (query) => {
        let list = "";
        return list.includes(query) ? true : false;
      },
    },
  }, {
    id: "password",
    value: "your self, as a child",
    classList: {
      contains: (query) => {
        let list = "hidden";
        return list.includes(query) ? true : false;
      },
    },
  },
];


export {
  users,
  rooms,
  bookings,
  allBooked,
  junk,
  inputNodes
}
