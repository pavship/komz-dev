import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'

import { Menu, Icon, Message} from 'semantic-ui-react'

import CreateProdModal from './CreateProdModal'
import MoveModal from './MoveModal'

import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'

class NavBar extends Component {

  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {

    const userId = this.props.user

    return (
      // <Menu fixed='top' inverted className='addclass'>
      <div>
        <Menu size='large' inverted >
          {/* <Container text> */}
          <Menu.Item header as={ NavLink } exact to='/'>KOMZ</Menu.Item>
          {userId &&
            <Menu.Menu>
              {/* <Menu.Item icon name='home' as={ NavLink } exact to='/' color='grey'>
                <Icon name='home' />
              </Menu.Item> */}
              <CreateProdModal trigger={
                <Menu.Item icon link name='create' color='grey'>
                  <Icon name='plus' />
                </Menu.Item>
              } />
              <MoveModal moveProds={this.props.moveProds} trigger={
                <Menu.Item icon link name='move' color='grey'>
                  <Icon name='arrow right' />
                </Menu.Item>
              } />
            </Menu.Menu>
          }
          <Menu.Menu position='right'>
            {userId ?
              <Menu.Item name='Выход' onClick={() => {
                localStorage.removeItem(GC_USER_ID)
                localStorage.removeItem(GC_AUTH_TOKEN)
                this.props.history.push(`/`)
              }} />
              :
              <Menu.Item name='Вход' as={ NavLink } exact to='/login' color='grey' />
            }
          </Menu.Menu>
          {/* </Container> */}
        </Menu>
        {!userId &&
          <Message warning>Войдите в систему, чтобы продолжить</Message>
        }
      </div>
    )
  }

}

export default withRouter(NavBar)
