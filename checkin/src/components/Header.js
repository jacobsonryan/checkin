import React from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";


class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clicked: false,
      dark: localStorage.getItem('theme') || true
    }
    this.handleClick = this.handleClick.bind(this)
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleDark = this.handleDark.bind(this)
  }

  componentDidMount() {
    let dark = JSON.parse(localStorage.getItem('theme'))
    this.setState({ dark })
    document.addEventListener('mousedown', this.handleClickOutside);
}

  componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
  }

handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({clicked: false})
    }
}

  handleClick() {
    this.setState({clicked: !this.state.clicked})
  }

  handleDark() {
    this.setState({dark: !this.state.dark})
    localStorage.setItem('theme', this.state.dark)
  }

  componentDidUpdate() {
    if(this.state.dark) {
      document.documentElement.style.setProperty("--background", "#f8f8f8");
      document.documentElement.style.setProperty("--card-color", "#f8f8f8");
      document.documentElement.style.setProperty("--accent-background", "#f8f8f8");
      document.documentElement.style.setProperty("--options-hover", "#d6d6d6");
      document.documentElement.style.setProperty("--text-color", "black");
      console.log(this.state.dark)
    } else {
      document.documentElement.style.setProperty("--card-color", "#0D1117");
      document.documentElement.style.setProperty("--background", "#090C10");
      document.documentElement.style.setProperty("--accent-background", "#161b22");
      document.documentElement.style.setProperty("--options-hover", "#28313d");
      document.documentElement.style.setProperty("--text-color", "white");
      console.log(this.state.dark)
    }
  }

  render() {
    return (
      <>
        <div className="nav">
          <div ref={this.wrapperRef} className="dropdown">
          <div className="initials" onClick={this.handleClick}>{this.props.name[0]}{this.props.lastName[0]}</div>
            <div className="dropdown-content" style={{display: this.state.clicked ? 'block' : 'none'}}>
              <p style={{color: 'var(--text-color)',padding: '15px', borderBottom: '1px solid rgba(128, 128, 128, 0.50)', margin: '0px'}}>Signed in as {this.props.name + " " + this.props.lastName}</p>
              <Link className="logout" to={this.props.route}>{this.props.pagename}</Link>
              <Link className="logout" onClick={this.handleDark}>Light Theme</Link>
              <Link style={{borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px'}} className="logout bottomlink" to="/login" onClick={this.props.logout}>Logout</Link>
            </div>
          </div>
        </div>
      </>
    );  
  }
}

export default Header;
