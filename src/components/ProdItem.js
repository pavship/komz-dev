import React, { Component } from 'react'
import { List } from 'semantic-ui-react'

class ProdItem extends Component {
  state = {
    checked: false
  }

  handleClick = (e, d) => {
    const { checked } = this.state
    const { id } = this.props.prod
    console.log(d)
    this.setState({checked: !checked})
    this.props.selectProd(id)
  }

  render() {
    const {checked} = this.state
    const {fullnumber, isSpoiled} = this.props.prod

    return (
      <List.Item onClick={this.handleClick} active={checked}>
        <List.Icon name={checked ? 'checkmark box' : 'square outline'} />
        <List.Content>
          {fullnumber}
        </List.Content>
        { isSpoiled && <List.Icon floated='right' name='broken chain' color='red' /> }
      </List.Item>
    )
  }
}

export default ProdItem
