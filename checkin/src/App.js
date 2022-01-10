import React from 'react'
import './App.css';
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import Posts from './components/Posts'
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <div>
        <main>
          <Switch>
            <Route path="/" component={ Home } exact />
            <Route path="/register" component={ Register } />
            <Route path="/login" component={ Login } />
            <Route path="/profile" component={ Posts } />
          </Switch>
        </main>
      </div>
    )}
}

export default App;
