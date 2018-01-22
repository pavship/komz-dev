import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Modal, Form, Menu, Icon, Button } from 'semantic-ui-react'
import { GC_USER_ID } from '../constants'

const AllDeptsAndModelsQuery = gql`
  query AllDeptsAndModelsQuery {
    allDepts {
      id
      name
    }
    allModels {
      id
      name
    }
  }
`

const CREATE_PROD_MUTATION = gql`
  mutation CreateProdMutation($createdById: ID!, $deptId: ID!, $modelId: ID!, $melt: Int!, $meltShift: Int, $number: Int!, $year: Int! ) {
    createProd(
      createdById: $createdById,
      deptId: $deptId,
      modelId: $modelId,
      melt: $melt,
      meltShift: $meltShift,
      number: $number,
      year: $year
    ) {
      id
    }
  }
`

class CreateProdModal extends Component {

  constructor(props){
    super(props)
    this.handleChange3 = this.handleChange3.bind(this)
    this.handleChange4 = this.handleChange4.bind(this)
  }

  state = {
    open: false,
    deptId: '',
    modelId: '',
    melt: '',
    meltShift: 0,
    number: '',
    year: 17
  }
  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })
  handleChange(e) {
    if (e) {
      this.setState({deptId: e.value})
      console.log(`Selected: ${ e.value}`)
    }
  }
  handleChange1(e) {
    if (e) {
      this.setState({modelId: e.value})
      console.log(`Selected: ${ e.value}`)
    }
  }
  handleChange3(event, e) {
    if (e) {
      // console.log(value);
      this.setState({deptId: e.value})
      console.log(`Selected: ${ e.value}`)
    }
  }
  handleChange4(event, e) {
    if (e) {
      this.setState({modelId: e.value})
      console.log(`Selected: ${ e.value}`)
    }
  }

  render() {
    const { open, deptId, modelId } = this.state
    const { trigger } = this.props

    const query = this.props.AllDeptsAndModelsQuery
    const deptOptions = !query ? [ { text: 'Участок ', value: '' } ] :
      query.loading ? [ { text: 'Загрузка списка', value: '' } ] :
      query.error ? [ { text: 'Ошибка загрузки списка', value: '' } ] :
      query.allDepts.map(dept => {
        return {
          text: dept.name,
          value:  dept.id
        }
      })
    const modelOptions = !query ? [ { text: 'Вид продукции', value: '' } ] :
      query.loading ? [ { text: 'Загрузка списка', value: '' } ] :
      query.error ? [ { text: 'Ошибка загрузки списка', value: '' } ] :
      query.allModels.map(model => {
        return {
          text: model.name,
          value:  model.id
        }
      })
    return (
      <Modal
        trigger = { trigger }
        open={open}
        onOpen={this.open}
        onClose={this.close}
      >
        <Modal.Header as='h2'> Добавить продукцию </Modal.Header>
        <Modal.Content>
          <Form onSubmit={() => this._confirm()}>
            <Form.Select label='Участок' options={deptOptions} onChange={this.handleChange3} value={deptId} required/>
            <Form.Select label='Вид продукции' options={modelOptions} onChange={this.handleChange4} value={modelId} required/>
            <Form.Group widths='equal'>
              <Form.Input label='Плавка' placeholder='Плавка' required
                type="number" min="1" max="999"
                onChange={(e) => this.setState({ melt: parseInt(e.target.value, 10) })} value={this.state.melt}/>
              <Form.Input label='Плав. смена (0 - если не промаркирована)' placeholder='Пл. смена'
                type="number" min="1" max="3"
                onChange={(e) => this.setState({ meltShift: parseInt(e.target.value, 10) }) } value={this.state.meltShift}/>
              <Form.Input label='Номер' placeholder='Номер' required
                type="number" min="1" max="999"
                onChange={(e) => this.setState({ number: parseInt(e.target.value, 10) })} value={this.state.number}/>
              <Form.Input label='Год' placeholder='Год' required
                type="number" min="16" max="18"
                onChange={(e) => this.setState({ year: parseInt(e.target.value, 10) })} value={this.state.year}/>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.close} color='red'>
            <Icon name='remove' /> Отмена
          </Button>
          <Button onClick={() => this._confirm()}>
            <Icon name='checkmark' /> Добавить
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  _confirm = () => {
    const createdById = localStorage.getItem(GC_USER_ID)
    const { deptId, modelId, melt, meltShift, number, year } = this.state
    console.log(createdById, deptId, modelId, melt, meltShift, number, year)

    this.props.createProdMutation ({
      variables: {
        createdById,
        deptId,
        modelId,
        melt,
        meltShift,
        number,
        year
      }
    })
    this.close()
  }
}

export default compose(
  graphql(AllDeptsAndModelsQuery, { name: 'AllDeptsAndModelsQuery' }),
  graphql(CREATE_PROD_MUTATION, { name: 'createProdMutation' })
)(CreateProdModal)
