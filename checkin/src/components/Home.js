import React from 'react'
import '../App.css';
import axios from 'axios'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import { Button, Form, Modal } from 'react-bootstrap';
import PlacesAutocomplete from 'react-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt from 'jsonwebtoken'
import Header from '../components/Header'
import TimeAgo from 'react-timeago'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      reports: [],
      name: '',
      userId: '',
      location: '',
      longitude: '',
      latitude: '',
      address: '',
      lastName: '',
      likes: 0,
      color: '#007bff',
      show: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.logout = this.logout.bind(this)
    this.updateLike = this.updateLike.bind(this)
  }

   handleClose = () => this.setState({show: false});
   handleShow = () => this.setState({show: true});

  componentDidMount() {
    let token = localStorage.getItem('jwt-token')
    if(!token) {
      this.props.history.push('/login')
    } else {
      this.setState({ name: jwt.decode(token).firstName, userId: jwt.decode(token).userId, lastName: jwt.decode(token).lastName })
      axios.get(`http://localhost:5000/api/all-reports`, {headers: {Authorization: `Bearer ${token}`, user_id: jwt.decode(token).userId}})
      .then(res => {
        this.setState({ reports: res.data.reverse() });
      }).catch(err => {
        this.setState({ name: '', userId: '', lastName: '' })
        localStorage.removeItem('jwt-token')
        this.props.history.push('/login')
      })
    }
  }

  handleSubmit = event => {  
    event.preventDefault()
    let token = localStorage.getItem('jwt-token')
    axios.post('http://localhost:5000/api/new-report', {
      userId: this.state.userId,
      name: this.state.name,
      location: this.state.location,
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      status: this.state.status,
      likes: this.state.likes
    }, {headers: {Authorization: `Bearer ${token}`}})
    .then((res) => {
      axios.get(`http://localhost:5000/api/all-reports`, {headers: {Authorization: `Bearer ${token}`, user_id: this.state.userId}})
      .then(res => {
        this.setState({ reports: res.data.reverse(), location: '', address: '', latitude: '', longitude: '', status: '', show: false });
      })
    }) 
  }

  handleAddress = address => {
    this.setState({ address });
  };

  handleChange(e) {
    this.setState({ [e.target.name] : e.target.value });
  }

  handleSelect = address => {
    geocodeByAddress(address)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      let formattedAddress = address.split(', ')
      let town = formattedAddress[formattedAddress.length - 3]
      if(!town) {
        town = ''
      } else {
        town = town + ", "
      }
      this.setState({latitude: latLng.lat.toString(), longitude: latLng.lng.toString(), address, location: town + formattedAddress[formattedAddress.length - 2]})
    })
  };

  logout() {
    localStorage.removeItem('jwt-token')
  }

  updateLike(postId) {
    axios.post('http://localhost:5000/api/like', {
      post_id: postId,
      user_id: this.state.userId
    }).then((res) => {
        this.setState({ reports: res.data.reverse() });
    })
  }

  render() {
    return (
      <>
        <Header name={this.state.name} lastName={this.state.lastName} logout={this.logout} route="/profile" pagename="Profile" />
        <div className="App" style={{backgroundColor: 'var(--background)', color: 'var(--text-color)'}}>
        <h1>Check in</h1>
        <div className="modal">
          <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
            <Modal.Header style={{backgroundColor: 'var(--background)', border: '1px solid rgba(128, 128, 128, 0.50)', color: 'var(--text-color)'}}>
              <Modal.Title>{this.state.name} {this.state.lastName}'s Post</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: 'var(--background)', borderLeft: '1px solid rgba(128, 128, 128, 0.50)', borderRight: '1px solid rgba(128, 128, 128, 0.50)', color: 'var(--text-color)'}}>
              <form onSubmit={this.handleSubmit}>
                <Form.Group  controlId="formBasicEmail">
                  <Form.Label>Location</Form.Label>
                  <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.handleAddress}
                    onSelect={this.handleSelect}
                  >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                      <Form.Control style={{backgroundColor: 'var(--background)', color: 'var(--text-color)', border: '1px solid rgba(128, 128, 128, 0.50)'}} 
                      required
                      size="lg"
                        {...getInputProps({
                          className: 'location-search-input'
                        })}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                          const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                          const style = suggestion.active
                            ? { backgroundColor: '#2a384a', cursor: 'pointer' }
                            : { backgroundColor: '#19212c', cursor: 'pointer' };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </PlacesAutocomplete>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label style={{margin: '15px 0px 8px 0px'}}>What's on your mind {this.state.name}?</Form.Label>
                    <Form.Control style={{backgroundColor: 'var(--background)', color: 'var(--text-color)', border: '1px solid rgba(128, 128, 128, 0.50)'}} size="lg" as="textarea" name="status" value={this.state.status} onChange={this.handleChange} rows={3} />
                  </Form.Group>
                </Form.Group>
            </form>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor: 'var(--background)', border: '1px solid rgba(128, 128, 128, 0.50)', color: 'var(--text-color)'}}>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div className="top">
          <div className="initials">{this.state.name[0]}{this.state.lastName[0]}</div>
          <div className="create" onClick={this.handleShow}><p>Where are you checking in from, {this.state.name}?</p></div>
        </div>
        <div className="separator">Latest Posts</div>
        <div className="report-container">
          {this.state.reports.map((report) => {
            return (
              <div className="reports" key={report.id}>
                <div className="text">
                  <h3>{report.name} checked in from {report.location}</h3>
                  <p className="status">{report.status}</p>
                  <div className="likes">
                    <i onClick={() => this.updateLike(report.id)} style={{color: report.color}} className="fas fa-thumbs-up"></i>
                    <p>{report.likes}</p>
                  </div>
                  <p className="createdAt">{report.createdAt.split("T")[0]}</p>
                </div>
                <MapContainer style={{ margin: '0px', height: '400px', width: '800px', borderRadius: '10px'}} center={[report.latitude, report.longitude]} zoom={10} scrollWheelZoom={true} zoomControl={true} doubleClickZoom={false}>
                  <TileLayer url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}" />
                  <Circle center={[report.latitude, report.longitude]} radius={4000} />
                </MapContainer>
              </div>
            )
          })}
        </div>
      </div>
      </>
    );  
  }
}

export default Home;
