import React from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import axios from 'axios'

class Reports extends React.Component {
    render() {
    return (
      <>
        <div className="report-container">
          {this.props.reports.map((report) => {
            return (
              <div className="reports" key={report.id}>
                <div className="text">
                  <h3>{report.name} checked in from {report.location}</h3>
                  <p className="status">{report.status}</p>
                  <i onClick={() =>this.props.updateLike(report.id)} className="fas fa-thumbs-up"></i>
                  <p>{report.likes}</p>
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
      </>
    );  
  }
}

export default Reports;
