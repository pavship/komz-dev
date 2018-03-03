import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import _ from 'lodash'

import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'
import { Menu, Icon, Message, Dropdown} from 'semantic-ui-react'
import CRUProdModal from './CRUProdModal'
import MoveModal from './MoveModal'

class NavBar extends Component {

  state = {
    selectedTypes: ['OWNED', 'TRANSPORT'],
    allTypes: [{
      type: 'OWNED',
      title: 'Наши'
    },{
      type: 'TRANSPORT',
      title: 'Транспорт'
    },{
      type: 'PARTNER',
      title: 'Подрядчики'
    },{
      type: 'CLIENT',
      title: 'Клиенты'
    }]
  }

  handleItemClick = (e, { type }) => this.setState({ activeItem: type })

  filterDeptType = (event, {type}) => {
    this.props.filterDeptType(type)
    const { selectedTypes } = this.state
    const newList = _.includes(selectedTypes, type) ? _.without(selectedTypes, type) : [...selectedTypes, type]
    this.setState({ selectedTypes: newList })
  }

  render() {

    const {selectedTypes, allTypes} = this.state
    const {user, filterDeptType} = this.props
    const userId = user

    const deptTypeMenuItems = allTypes.map(({type, title}) => {
      const active = _.includes(selectedTypes, type)
      return (
        <Dropdown.Item
          key={type}
          type={type}
          active={active}
          onClick={this.filterDeptType}
        >
          <Icon name={active ? 'checkmark box' : 'square outline'} />
          {title}
        </Dropdown.Item>
    )})

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
            </Menu.Menu>
          }
          <Menu.Menu position='right'>
            {userId &&
              <Dropdown item icon='setting' simple className='komz-navBarSettingsItem'>
                <Dropdown.Menu>
                  {/* <Dropdown.Header>Вид</Dropdown.Header>
                  <Dropdown.Item active>По участкам</Dropdown.Item>
                  <Dropdown.Item>По продукции</Dropdown.Item>
                  <Dropdown.Divider /> */}
                  <Dropdown.Header>Участки</Dropdown.Header>
                  { deptTypeMenuItems }
                </Dropdown.Menu>
              </Dropdown>
            }
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
