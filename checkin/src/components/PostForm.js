import React from 'react'
import { Form, Button } from 'react-bootstrap';
import PlacesAutocomplete from 'react-places-autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";


class PostForm extends React.Component {
  render() {
    return (
      <>
<form onSubmit={this.handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Location</Form.Label>
          <PlacesAutocomplete
            value={this.props.address}
            onChange={this.props.handleAddress}
            onSelect={this.props.handleSelect}
          >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <Form.Control
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
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
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
            <Form.Label style={{margin: '15px 0px 8px 0px'}}>What's on your mind {this.props.name}?</Form.Label>
            <Form.Control size="lg" as="textarea" name="status" value={this.props.status} onChange={this.props.handleChange} rows={3} />
          </Form.Group>
        </Form.Group>
        <div className="btns">
          <Button variant="primary" type="submit">Submit</Button>
        </div>
        </form>
      </>
    );  
  }
}

export default PostForm;
