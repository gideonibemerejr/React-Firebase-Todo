import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'
import { login, logout, createTodo, auth } from './utils/firebaseService'

const linkStyle = {
  textDecoration: 'underline',
  color: 'rebeccapurple',
  cursor: 'pointer'
}

/**********************************
 // * Private Routes
 **********************************/

const PrivateRoute = ({ authenticated, component: Component, ...rest }) => {
  return (
    <Route
      render={props =>
        authenticated ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  )
}
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

const Dashboard = ({ user, handleSubmit, handleChange, text }) => {
  return (
    <div>
      <h2>Welcome to your Dashboard, {user.displayName.split(' ')[0]}</h2>
      <img
        src={user.photoURL}
        alt={user.diisplayName}
        style={{
          height: 100,
          borderRadius: '50%',
          border: '2px solid black'
        }}
      />
      <hr />
      <h5>Here's your todo Items</h5>
      <ul>{/* TODO: We will map through our items here  */}</ul>
      <form onSubmit={handleSubmit}>
        <input name="text" type="text" value={text} onChange={handleChange} />
        <button>Add TODO</button>
      </form>
    </div>
  )
}

const Login = ({ authenticated }) => {
  if (authenticated) return <Redirect to="/dashboard" />
  return (
    <div>
      <h2>You need to be logged in to see this page</h2>
      <button onClick={login}>Login with Google</button>
    </div>
  )
}

// * Parent Component
class App extends Component {
  state = {
    authenticated: false,
    user: null,
    text: '',
    dbRef: null
  }

  /************************
    # Methods
  *************************/
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    const { dbRef, text } = this.state
    e.preventDefault()
    createTodo(dbRef, {
      text,
      completed: false
    }).then(() => this.setState({ text: '' }))
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          user,
          dbRef: `users/${user.uid}/todos`
        })
      } else {
        this.setState({ authenticated: false, user: null, dbRef: null })
      }
    })
  }

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
          {this.state.authenticated && (
            <li>
              <span onClick={logout} style={linkStyle}>
                Logout
              </span>
            </li>
          )}
        </ul>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute
            authenticated={this.state.authenticated}
            user={this.state.user}
            text={this.state.text}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            path="/dashboard"
            component={Dashboard}
          />
          <Route
            path="/login"
            render={props => (
              <Login {...props} authenticated={this.state.authenticated} />
            )}
          />
        </Switch>
      </Router>
    )
  }
}

export default App
