import React, { Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import web3 from 'web3';

import './Events.scss';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedEvent: null,
      events: [],
      confirmPassword: null
    };
    this.renderListItem = this.renderListItem.bind(this);
    this.buyTicket = this.buyTicket.bind(this);
  }

  componentDidMount() {
    this.props.getEvents();
  }

  async buyTicket(event, password) {
    this.setState({isLoading: true});
    await this.props.buyTicket(event, password);
    await this.props.getEvents();
    this.setState({ isLoading: false, buyModalOpen: false });
  }

  renderListItem(item, index) {
    return (
      <tr key={item.id} className={classNames('eventRow', {'odd': (index % 2 !== 0)})}>
        <td style={{flex: 2}}>{item.name}</td>
        <td>{web3.utils.fromWei(item.price, 'ether')} ETH</td>
        <td>{item.qty} Left</td>
        <td><button onClick={() => {
          this.setState({'buyModalOpen': true, selectedEvent: item });
        }}>Buy Ticket</button></td>
      </tr>
    );
  }

  render() {
    let { selectedEvent, confirmPassword, isLoading } = this.state;

    return (
      <div className='events-container'>
        <h1>Upcoming Events</h1>
        <table>
          <th>
            <td style={{flex: 2}}>Name</td>
            <td>Price</td>
            <td>Qty Remaining</td>
            <td className="actions">Actions</td>
          </th>
          <tbody>
            {this.props.events.map((event, index) => {
              return this.renderListItem(event, index);
            })}
          </tbody>
        </table>
        <ReactModal
          isOpen={this.state.buyModalOpen}
          contentLabel="Payment Modal"
          onRequestClose={() => {
            if (!this.state.isLoading) {
              this.setState({buyModalOpen: false});
            }
          }}
          style={require('./../../../layouts/modal-styles').default}
        >
          <h2 className="checkout-header">Buy a Ticket</h2>
          <div className="event-details">
            <span className="event-header">Event Details</span>
            <span className='event-name'><b>Name:</b> {selectedEvent && selectedEvent.name}</span>
            <span className='event-price'><b>Price:</b> {selectedEvent && web3.utils.fromWei(selectedEvent.price, 'ether')} ETH</span>
            <input
              style={{textAlign: 'center', }}
              value={confirmPassword}
              placeholder="enter password to confirm purchase"
              onChange={(e) => {
                console.log('confirmPassword: ', confirmPassword);
                this.setState({confirmPassword: e.target.value });
              }}/>
            <button
              className={classNames('purchase-ticket', {isLoading: isLoading, notLoading: !isLoading })}
              onClick={() => {
                console.log('this.state.confirmPassword: ', confirmPassword);
                this.buyTicket(selectedEvent, confirmPassword);
              }}>
              { (isLoading) ? <img src={require('../../../layouts/assets/img/spinner.svg')} /> : 'Confirm Purchase'}
            </button>
          </div>
        </ReactModal>
      </div>
    );
  }
}

export default Events;
