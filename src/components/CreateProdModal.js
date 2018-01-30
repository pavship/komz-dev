import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { GC_USER_ID } from '../constants'
import { Modal, Form, Menu, Icon, Button } from 'semantic-ui-react'

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
  mutation CreateProdMutation($createdById: ID!, $deptId: ID!, $modelId: ID!, $melt: Int!, $meltShift: Int, $number: Int!, $year: Int!, $progress: Float ) {
    createProd(
      createdById: $createdById,
      deptId: $deptId,
      modelId: $modelId,
      melt: $melt,
      meltShift: $meltShift,
      number: $number,
      year: $year,
      progress: $progress
    ) {
      id
    }
  }
`

const updateProdMutation = gql`
  mutation updateProdMutation($prodId: ID!, $updatedById: ID!, $melt: Int!, $meltShift: Int, $number: Int!, $year: Int!, $progress: Float) {
    updateProd(
      id: $prodId
      updatedById: $updatedById,
      melt: $melt,
      meltShift: $meltShift,
      number: $number,
      year: $year,
      progress: $progress
    ) {
      id
    }
  }
`

class CreateProdModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      deptId: '',
      modelId: '',
      melt: '',
      meltShift: 0,
      number: '',
      year: '',
      progress: ''
    }

    if (props.mode === 'edit') {
      this.state.id = props.prod.id
      this.state.melt = props.prod.melt
      this.state.meltShift = props.prod.meltShift
      this.state.number = props.prod.number
      this.state.year = props.prod.year
      this.state.progress = props.prod.progress || ''
    }

  }

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })
  handleChange = (event, e) => {
    if (e) {
      this.setState({deptId: e.value})
      console.log(`Selected: ${ e.value}`)
    }
  }
  handleChange1 = (event, e) => {
    if (e) {
      this.setState({modelId: e.value})
      console.log(`Selected: ${ e.value}`)
    }
  }
  handleChange3 = (event, e) => {
    if (e) {
      // console.log(value);
      this.setState({deptId: e.value})
      console.log(`Selected: ${ e.value}`)
    }
  }
  handleChange4 = (event, e) => {
    if (e) {
      this.setState({modelId: e.value})
      console.log(`Selected: ${ e.value}`)
    }
  }

  render() {
    const { open, deptId, modelId } = this.state
    const { prod, trigger, mode } = this.props
    let deptOptions = [{ text: 'Участок ', value: '' }]
    let modelOptions = [{ text: 'Вид продукции', value: '' }]

    if (mode === 'create') {
      const query = this.props.AllDeptsAndModelsQuery
      deptOptions = !query ? [ { text: 'Участок ', value: '' } ] :
      query.loading ? [ { text: 'Загрузка списка', value: '' } ] :
      query.error ? [ { text: 'Ошибка загрузки списка', value: '' } ] :
      query.allDepts.map(dept => {
        return {
          text: dept.name,
          value:  dept.id
        }
      })
      modelOptions = !query ? [ { text: 'Вид продукции', value: '' } ] :
      query.loading ? [ { text: 'Загрузка списка', value: '' } ] :
      query.error ? [ { text: 'Ошибка загрузки списка', value: '' } ] :
      query.allModels.map(model => {
        return {
          text: model.name,
          value:  model.id
        }
      })
    } else if (mode === 'edit') {

    }
    return (
      <Modal
        trigger = { trigger }
        open={open}
        onOpen={this.open}
        onClose={this.close}
      >
        <Modal.Header as='h2'>{mode === 'create' ? 'Добавить' : 'Редактировать'} продукцию </Modal.Header>
        <Modal.Content>
          <Form onSubmit={() => this._confirm()}>
            { (mode === 'create') &&
              <Form.Select label='Участок' options={deptOptions} onChange={this.handleChange3} value={deptId} required />
            }
            { (mode === 'create') &&
              <Form.Select label='Вид продукции' options={modelOptions} onChange={this.handleChange4} value={modelId} required />
            }
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
            <Form.Input label='Процент завершения' placeholder='%'
              type="number" min="0" max="100"
              onChange={(e) => this.setState({ progress: parseInt(e.target.value, 10) })} value={this.state.progress}/>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.close} color='red'>
            <Icon name='remove' /> Отмена
          </Button>
          <Button onClick={this._confirm}>
            <Icon name='checkmark' /> {mode === 'create' ? 'Добавить' : 'Сохранить'}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  _confirm = () => {
    const createdById = localStorage.getItem(GC_USER_ID)
    const updatedById = createdById
    const { id, deptId, modelId, melt, meltShift, number, year } = this.state
    const progress = this.state.progress || null
    const mode = this.props.mode
    const prodId = id
    if (mode === 'create') {
      console.log(createdById, deptId, modelId, melt, meltShift, number, year, progress)
      this.props.createProdMutation ({
        variables: {
          createdById,
          deptId,
          modelId,
          melt,
          meltShift,
          number,
          year,
          progress
        }
      })
    } else if (mode === 'edit') {
      console.log(prodId, updatedById, melt, meltShift, number, year, progress)
      this.props.updateProdMutation ({
        variables: {
          prodId,
          updatedById,
          melt,
          meltShift,
          number,
          year,
          progress
        }
      })
    }
    this.close()
  }
}

export default compose(
  graphql(AllDeptsAndModelsQuery, { name: 'AllDeptsAndModelsQuery' }),
  graphql(CREATE_PROD_MUTATION, { name: 'createProdMutation' }),
  graphql(updateProdMutation, { name: 'updateProdMutation' })
)(CreateProdModal)
