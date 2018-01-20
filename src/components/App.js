import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import { GC_USER_ID } from '../constants'

import { Container } from 'semantic-ui-react'
import Login from './Login'
import Store from './Store'

class App extends Component {
  render() {

    const userId = localStorage.getItem(GC_USER_ID)
    // const user = {
    //   id: userId
    // }

    return (
      <Container text>
        <Switch>
          <Route exact path='/' render={(props) => ( <Store user={userId} /> )} />
          <Route exact path='/login' component={Login}/>
        </Switch>
      </Container>
    )
  }
}

export default App
