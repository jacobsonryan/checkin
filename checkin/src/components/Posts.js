import React from 'react'
import '../App.css';
import axios from 'axios'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import jwt from 'jsonwebtoken'
import Header from '../components/Header'
import  Dropdown  from '../components/Dropdown';

class Posts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      reports: [],
      name: '',
      userId: '',
      lastName: '',
      darkMode: localStorage.getItem('dark-mode')
    }
    this.delete = this.delete.bind(this)
  }

  
  componentDidMount() {
    let token = localStorage.getItem('jwt-token')
    let name = jwt.decode(token).firstName
    let lastName = jwt.decode(token).lastName
    let userId = jwt.decode(token).userId
    let email = jwt.decode(token).email
    this.setState({ name, lastName, userId, email })
    axios.post(`http://localhost:5000/api/your-posts`,{userId: userId})
    .then(res => {
      this.setState({reports: res.data.reverse()})
    })
  }

  delete(reportId) {
    axios.delete(`http://localhost:5000/api/delete/${reportId}`)
    .then(res => {
      axios.post(`http://localhost:5000/api/your-posts`,{userId: this.state.userId})
    .then(res => {
      this.setState({reports: res.data})
    })
    })
  }
  
  render() {
    return (
      <>
        <Header name={this.state.name} lastName={this.state.lastName} logout={this.logout} route="/" pagename="Home" />
        <div className="App" style={{backgroundColor: 'var(--background)', color: 'var(--text-color'}}>
        <div className="emblem">
          <div className="profile-initials">{this.state.name[0]}{this.state.lastName[0]}</div>
        </div>
        <div className="profile">
          <h2>{this.state.name} {this.state.lastName}</h2>
          <p>{this.state.email}</p>
        </div>
        <div className="separator">Your Posts</div>
        <div className="report-container" >
          {this.state.reports.map((report) => {
            return (
              <div className="reports" key={report.id}>
                <div className="text">
                  <h3>{report.name} checked in from {report.location}</h3>
                  <p className="status">{report.status}</p>
                  <p className="createdAt">{report.createdAt.split("T")[0]}</p>
                </div>
                <MapContainer style={{ margin: '0px', height: '400px', width: '800px', borderRadius: '10px'}} center={[report.latitude, report.longitude]} zoom={10} scrollWheelZoom={true} zoomControl={true} doubleClickZoom={false}>
                  <TileLayer url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}" />
                  <Circle center={[report.latitude, report.longitude]} radius={4000} />
                </MapContainer>
                <Dropdown delete={() => this.delete(report.id)} />
                </div>
            )
          })}
        </div>
      </div>
      </>
    );  
  }
}

export default Posts;
