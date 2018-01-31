import React, { Component } from 'react'
import { List, Progress, Label, Button } from 'semantic-ui-react'
import CRUProdModal from './CRUProdModal'

class ProdItem extends Component {
  state = {
    checked: false
  }

  handleClick = (e, d) => {
    const { checked } = this.state
    const { id } = this.props.prod
    this.setState({checked: !checked})
    this.props.selectProd(id)
  }

  preventPropagation = (e, eb) => {
    e.preventDefault()
    e.stopPropagation()
  }

  render() {
    const {checked} = this.state
    const {id, melt, meltShift, number, year, fullnumber, progress, isSpoiled, hasDefect, note} = this.props.prod

    return (
      <List.Item onClick={this.handleClick} active={checked}>
        <List.Content>
          <List.Content floated='right'>
            {/* <Button attached='right'>Edit</Button> */}
            {/* <Button size='mini' onClick={this.preventPropagation}>Edit</Button> */}
            {/* <Button size='mini' icon='edit' onClick={this.preventPropagation} /> */}
            {/* <Button size='mini' content='Редакт' icon='edit' labelPosition='right' onClick={this.preventPropagation} /> */}
            {/* <List.Icon name='edit' onClick={this.edit} /> */}
            <CRUProdModal mode='edit' prod={this.props.prod} trigger={
              <Button size='mini' content='Редакт' icon='edit' labelPosition='right' onClick={this.preventPropagation} />
            } />
          </List.Content>
          <List.Content>
            <List.Icon name={checked ? 'checkmark box' : 'square outline'} />
            {melt}{(meltShift > 0) && '.'+meltShift}-{number}-{year}
            { progress &&
              <Label size='small'>{progress || '_'}%</Label>
            }
            { hasDefect &&
              <Label color='orange' tag size='small'>ОТКЛОНЕНИЕ</Label>
            }
            { isSpoiled &&
              <Label color='red' tag size='small'>БРАК</Label>
              // <List.Icon floated='right' name='broken chain' color='red' />
            }
          </List.Content>

        </List.Content>
        { progress &&
          <Progress percent={progress} indicating autoSuccess attached='bottom' />
        }
      </List.Item>
    )
  }
}

export default ProdItem
