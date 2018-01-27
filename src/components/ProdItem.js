import React, { Component } from 'react'
import { List, Progress, Label } from 'semantic-ui-react'

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
    const {fullnumber, progress, isSpoiled, hasDefect, note} = this.props.prod

    return (
      <List.Item onClick={this.handleClick} active={checked}>
        <List.Content>
          <List.Icon name={checked ? 'checkmark box' : 'square outline'} />
          {fullnumber}
          <Label size='small'>{progress || '_'}%</Label>
          { hasDefect &&
            <Label color='orange' tag size='small'>ОТКЛОНЕНИЕ</Label>
          }
          { isSpoiled &&
            <Label color='red' tag size='small'>БРАК</Label>
            // <List.Icon floated='right' name='broken chain' color='red' />
          }
        </List.Content>
        <Progress percent={progress} indicating autoSuccess attached='bottom' />
      </List.Item>
    )
  }
}

export default ProdItem
