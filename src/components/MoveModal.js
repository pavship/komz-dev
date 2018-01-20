import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Modal, Form, Icon, Button } from 'semantic-ui-react'

const AllDeptsAndModelsQuery = gql`
  query AllDeptsAndModelsQuery {
    allDepts {
      id
      name
    }
  }
`

class MoveModal extends Component {

  state = {
    open: false,
    deptId: 'cjbuuv9ka4s3l0162qzn4zy5x'
  }
  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })
  handleChange = (event, e) => {
    if (e) {
      // console.log(value);
      this.setState({deptId: e.value})
      console.log(`Selected: ${ e.value}`)
    }
  }
  confirm = () => {
    const { deptId } = this.state
    this.props.moveProds(deptId)
    this.close()
  }

  render() {
    const { open, deptId } = this.state
    const query = this.props.AllDeptsAndModelsQuery
    const deptOptions = !query ? [ { text: 'Участок ', value: 'cjbuuv9ka4s3l0162qzn4zy5x' } ] :
      query.loading ? [ { text: 'Загрузка списка', value: 'cjbuuv9ka4s3l0162qzn4zy5x' } ] :
      query.error ? [ { text: 'Ошибка загрузки списка', value: 'cjbuuv9ka4s3l0162qzn4zy5x' } ] :
      query.allDepts.map(dept => {
        return {
          text: dept.name,
          value:  dept.id
        }
      })

    return (
      <Modal
        trigger={<Icon name='arrow right' />}
        open={open}
        onOpen={this.open}
        onClose={this.close}
      >
        <Modal.Header as='h2'> Отправить продукцию </Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.confirm}>
            <Form.Select label='Куда' options={deptOptions} onChange={this.handleChange} value={this.state.deptId}/>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.close} color='red'>
            <Icon name='remove' /> Отмена
          </Button>
          <Button onClick={this.confirm}>
            <Icon name='arrow right' /> Отправить
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

}

export default graphql(AllDeptsAndModelsQuery, { name: 'AllDeptsAndModelsQuery' })(MoveModal)
