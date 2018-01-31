import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import { Menu, Icon, Message, Dropdown} from 'semantic-ui-react'
import CRUProdModal from './CRUProdModal'
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
        <Menu size='huge' inverted >
          {/* <Container text> */}
          <Menu.Item header as={ NavLink } exact to='/'>KOMZ</Menu.Item>
          {userId &&
            <Menu.Menu>
              {/* <Menu.Item icon name='home' as={ NavLink } exact to='/' color='grey'>
                <Icon name='home' />
              </Menu.Item> */}
              <CRUProdModal mode='create' id='' trigger={
                <Menu.Item icon link name='create' color='grey'>
                  <Icon name='plus' />
                </Menu.Item>
              } />
              <MoveModal moveProds={this.props.moveProds} trigger={
                <Menu.Item icon link name='move' color='grey'>
                  <Icon name='arrow right' />
                </Menu.Item>
              } />
              {/* <Dropdown item icon='options' simple>
                <Dropdown.Menu>
                  <Dropdown.Header>Вид</Dropdown.Header>
                  <Dropdown.Item active>По участкам</Dropdown.Item>
                  <Dropdown.Item>По продукции</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Header>Участки</Dropdown.Header>
                  <Dropdown.Item>
                    <Icon name='square outline' />
                    Наши
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Icon name='square outline' />
                    Подрядчики
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Icon name='square outline' />
                    Транспорт
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Icon name='square outline' />
                    Клиенты
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown> */}
            </Menu.Menu>
          }
          <Menu.Menu position='right'>
            {userId ?
              <Menu.Item icon onClick={() => {
                localStorage.removeItem(GC_USER_ID)
                localStorage.removeItem(GC_AUTH_TOKEN)
                this.props.history.push(`/`)
              }} >
                <Icon name='sign out' />
              </Menu.Item>
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
