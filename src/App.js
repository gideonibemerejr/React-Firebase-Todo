import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

/**********************************
 // * Components
 **********************************/

const Home = () => {
  return (
    <div>
      <h1>Welcome to React Firebase Todos</h1>
    </div>
  )
}

const Dashboard = () => {
  return (
    <div>
      <h2>Welcome to your Dashboard</h2>
    </div>
  )
}

const Login = () => {
  return (
    <div>
      <h2>YOu need to be logged in to see this page</h2>
      <button>Login with Google</button>
    </div>
  )
}

// * Parent Component
class App extends Component {
  state = {}
  render() {
    return (
      <Router>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    )
  }
}

export default App
