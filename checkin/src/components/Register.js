import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPass: '',
      registered: false,
      passMatch: true
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name] : event.target.value });
  }

  handleSubmit = event => {  
    event.preventDefault()
    if(this.state.password === this.state.confirmPass) {
      axios.post('http://localhost:5000/api/new-user', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password
      })
      this.setState({registered: true, passMatch: true})
    } else {
      this.setState({passMatch: false})
    }
  }

  render() {
    return (
      <div className="register">
        <h1>Register</h1>
        <Form onSubmit={this.handleSubmit}>
            <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control style={{backgroundColor: '#19212c', color: 'white', border: '1px solid rgba(128, 128, 128, 0.50)'}} name="firstName" type="text" onChange={this.handleChange} value={this.state.firstName} placeholder="Enter First Name" required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control style={{backgroundColor: '#19212c', color: 'white', border: '1px solid rgba(128, 128, 128, 0.50)'}} name="lastName" type="text" onChange={this.handleChange} value={this.state.lastName} placeholder="Enter Last Name" required />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control style={{backgroundColor: '#19212c', color: 'white', border: '1px solid rgba(128, 128, 128, 0.50)'}} name="email" type="text" onChange={this.handleChange} value={this.state.email} placeholder="Enter Email" required />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control style={{backgroundColor: '#19212c', color: 'white', border: '1px solid rgba(128, 128, 128, 0.50)'}} name="password" type="password" onChange={this.handleChange} value={this.state.password} placeholder="Password" required />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control style={{backgroundColor: '#19212c', color: 'white', border: '1px solid rgba(128, 128, 128, 0.50)'}} name="confirmPass" type="password" onChange={this.handleChange} value={this.state.comfirmPass} placeholder="Confirm Password" required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Register
            </Button>
            <Link style={{marginLeft: '10px'}} to="/login">Login</Link>
            <Alert variant="danger" style={{marginTop: '15px', display: this.state.passMatch ? 'none' : 'block'}}>
              Passwords do not match.
            </Alert>
            <Alert variant="primary" style={{marginTop: '15px', display: this.state.registered ? 'block' : 'none'}}>
              You have successfully created an account. <Alert.Link><Link to="/login">Click here to log in.</Link></Alert.Link>
            </Alert>
        </Form>
      </div>
    );  
  }
}

export default Register;
