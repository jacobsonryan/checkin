import React from 'react'
import axios from 'axios'
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      wrongCredentials: false
    }
  }

  componentDidMount() {
    this.setState({loggedIn: false})
  }

  handleChange = event => {
    this.setState({ [event.target.name] : event.target.value });
  }

  handleSubmit = event => {  
    event.preventDefault()
    axios.post('http://localhost:5000/api/login', {
      email: this.state.email,
      password: this.state.password
    }).then(res => {
        if(res.status === 200) {
            localStorage.setItem('jwt-token', res.data.token)
            this.setState({loggedIn: true})
            this.props.history.push("/")
        } 
    }).catch(() => {
      this.setState({wrongCredentials: true})
    })
  }

  render() {
    return (
      <div className="register">
        <h1>Login</h1>
        <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control style={{backgroundColor: '#19212c', color: 'white', border: '1px solid rgba(128, 128, 128, 0.50)'}} name="email" type="text" onChange={this.handleChange} value={this.state.email} placeholder="Enter Email" required />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control style={{backgroundColor: '#19212c', color: 'white', border: '1px solid rgba(128, 128, 128, 0.50)'}} name="password" type="password" onChange={this.handleChange} value={this.state.password} placeholder="Password" required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
            <Link style={{marginLeft: '10px'}} to="/register">Register</Link>
            <Alert variant="danger" style={{marginTop: '15px', display: this.state.wrongCredentials ? 'block' : 'none'}}>
              Incorrect login, please try again.
            </Alert>
        </Form>
      </div>
    );  
  }
}

export default Login;
