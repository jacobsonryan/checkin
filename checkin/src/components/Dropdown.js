import React from 'react'
import '../App.css';

class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        clicked: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClick() {
    this.setState({clicked: !this.state.clicked})
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
        this.setState({clicked: false})
    }
   }
   
   

  render() {
    return (
      <>
        <div ref={this.wrapperRef} className="report-options">
            <i onClick={this.handleClick} className="fas fa-ellipsis-v"></i>
            <div className="post-options" style={{display: this.state.clicked ? 'block' : 'none'}}>
                <p style={{color: 'var(--text-color)', padding: '10px', borderBottom: '1px solid rgba(128, 128, 128, 0.50)', margin: '0px'}}>Options</p>
                <a style={{borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px'}} onClick={this.props.delete}>Delete Post</a>
            </div>
        </div>
      </>
    );  
  }
}

export default Dropdown;
