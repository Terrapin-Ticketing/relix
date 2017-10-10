import axios from 'axios';
import pasync from 'pasync';
import EthereumTx from 'ethereumjs-tx';
import crypto from 'crypto';
import web3 from '../../../components/Web3.js';

const gwei = 1000000000;

let getContractInstance = (abi, address) => {
  const instance = new web3.eth.Contract(abi, address);
  return instance;
};

let decryptPrivateKey = (key, ciphered) => {
  let algorithm = 'aes256';
  let inputEncoding = 'utf8';
  let outputEncoding = 'hex';

  let decipher = crypto.createDecipher(algorithm, key);
  let deciphered = decipher.update(ciphered, outputEncoding, inputEncoding);
  deciphered += decipher.final(inputEncoding);
  return deciphered;
};

// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENTS = 'GET_EVENTS';
export const CLICK_BUY_TICKET = 'CLICK_BUY_TICKET';
export const BUY_TICKET = 'BUY_TICKET';
export const SET_EVENTS = 'SET_EVENTS';

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */
export function getEvents() {
  return async (dispatch, getState) => {
    const { abis, terrapinAddress } = getState().terrapin;

    let terrapinInstance = getContractInstance(abis.terrapin.abi, terrapinAddress);

    let eventAddresses = await terrapinInstance.methods.getEvents().call();
    let events = [];
    await pasync.eachSeries(eventAddresses, async (eventAddress) => {
      let eventInstance = getContractInstance(abis.event.abi, eventAddress);
      let eventOwner = await eventInstance.methods.owner().call();

      // this take FOREVERRR to return. THIS is where our caching service will make a big difference
      let ticketAddresses = await eventInstance.methods.getTickets().call();

      let remaining = 0;
      await pasync.each(ticketAddresses, async (ticketAddress) => {
        let ticketInstance = getContractInstance(abis.ticket.abi, ticketAddress);
        let ticketOwner = await ticketInstance.methods.owner().call();
        if (eventOwner === ticketOwner) {
          remaining++;
        }
      });

      events.push({
        id: eventInstance.options.address,
        name: web3.utils.toAscii(await eventInstance.methods.name().call()),
        qty: remaining,
        price: await (getContractInstance(abis.ticket.abi, ticketAddresses[0]).methods.price().call())
      });

      dispatch({
        type: SET_EVENTS,
        payload: events
      });
    });
  };
}

export const buyTicket = (event, password) => {
  return async (dispatch, getState) => {
    let { walletAddress, encryptedPrivateKey } = getState().auth.user;
    let privateKey = decryptPrivateKey(password, encryptedPrivateKey).substring(2);
    privateKey = Buffer.from(privateKey, 'hex');

    let { abis } = getState().terrapin;

    let eventInstance = getContractInstance(abis.event.abi, event.id);
    let eventOwner = await eventInstance.methods.owner().call();

    let ticketAddresses = await eventInstance.methods.getTickets().call();
    let nonce = await web3.eth.getTransactionCount(walletAddress);
    let chainId = await web3.eth.net.getId();
    let gas = `0x${(4700000).toString(16)}`;
    let gasPrice = `0x${(gwei * 20).toString(16)}`;

    let isBreak = false;
    await pasync.eachSeries(ticketAddresses, async (ticketAddress) => {
      if (isBreak) return;
      let ticketInstance = getContractInstance(abis.ticket.abi, ticketAddress);
      let ticketOwner = await ticketInstance.methods.owner().call();

      if (ticketOwner === eventOwner) {
        let ticketPrice = parseInt(await ticketInstance.methods.price().call());

        let encodedAbi = ticketInstance.methods.buyTicket().encodeABI();
        let txParams = {
          nonce,
          chainId,
          to: ticketInstance.options.address,
          value: ticketPrice,
          gas,
          gasPrice,
          data: encodedAbi
        };

        let tx = new EthereumTx(txParams);
        tx.sign(new Buffer(privateKey));
        let serializedTx = tx.serialize();

        await web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`);

        let newOwner = await ticketInstance.methods.owner().call();
        isBreak = true;
      }
    });
  };
};

export const actions = {
  getEvents,
  buyTicket
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_EVENTS]: (state, action) => {
    return {
      ...state,
      events: action.payload
    };
  },
  [SET_EVENTS]: (state, action) => {
    return {
      ...state,
      events: action.payload
    };
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  events: []
};

export default function loginReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
