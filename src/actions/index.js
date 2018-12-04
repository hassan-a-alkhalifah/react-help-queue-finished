// Initialize Firebase with configerations / credentials
// Instantiat Firebase
import constants from './../constants';
const { firebaseConfig, c } = constants;
import Firebase from 'firebase';
import Moment from 'Moment';

firebase.initializeApp(firebaseConfig);
// ref specifies a tickets location (also known as a node) in database
const tickets = firebase.database().ref('tickets');

function receiveTicket(ticketFromFirebase) {
  return {
    type: c.RECEIVE_TICKET,
    ticket: ticketFromFirebase
  };
}

// Action createStore
export function addTicket(_names, _location, _issue) {
  // Adds new data to a node
  return () => tickets.push({
    names: _names,
    location: _location,
    issue: _issue,
    timeOpen: new Date().getTime()
  });
}

export function watchFirebaseTicketsRef() {
  return function(dispatch) {
    tickets.on('child_added', data => {
      const newTicket = Object.assign({}, data.val(), {
        id: data.getKey(),
        formattedWaitTime: new Moment(data.val().timeOpen).from(new Moment())
      });
      dispatch(receiveTicket(newTicket));
    });
  };
}
