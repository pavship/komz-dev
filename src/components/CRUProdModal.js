import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { GC_USER_ID } from '../constants'
import { Modal, Form, Menu, Icon, Button } from 'semantic-ui-react'

const allDeptsAndModelsQuery = gql`
  query allDeptsAndModelsQuery {
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

const createProdMutation = gql`
  mutation createProdMutation($createdById: ID!, $deptId: ID!, $modelId: ID!, $melt: Int!, $meltShift: Int, $number: Int!, $year: Int!, $progress: Float, $hasDefect: Boolean, $isSpoiled: Boolean ) {
    createProd(
      createdById: $createdById,
      deptId: $deptId,
      modelId: $modelId,
      melt: $melt,
      meltShift: $meltShift,
      number: $number,
      year: $year,
      progress: $progress,
      hasDefect: $hasDefect,
      isSpoiled: $isSpoiled
    ) {
      id
    }
  }
`

const updateProdMutation = gql`
  mutation updateProdMutation($prodId: ID!, $updatedById: ID!, $melt: Int!, $meltShift: Int, $number: Int!, $year: Int!, $progress: Float, $hasDefect: Boolean, $isSpoiled: Boolean) {
    updateProd(
      id: $prodId
      updatedById: $updatedById,
      melt: $melt,
      meltShift: $meltShift,
      number: $number,
      year: $year,
      progress: $progress,
      hasDefect: $hasDefect,
      isSpoiled: $isSpoiled
    ) {
      id
    }
  }
`

class CRUProdModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      deptId: '',
      modelId: '',
      melt: '',
      meltShift: '',
      number: '',
      year: '',
      progress: '',
      hasDefect: false,
      isSpoiled: false,
      deptIdErr: false,
      modelIdErr: false,
      meltErr: false,
      meltShiftErr: false,
      numberErr: false,
      yearErr: false,
      progressErr: false
    }

    if (props.mode === 'edit') {
      this.state = {
        ...this.state,
        ...props.prod
      }
      // replace nulls with '' for React controlled components to work
      for(let k in this.state) {(this.state[k] === null) && (this.state[k] = '')}
    }

  }

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  handleSelChange = (event, {name, value, required}) => {
    //style input as warning if value is not appropriate
    const warn = (value === '' && required) ? true : false
    this.setState({
      [name]: value,
      [`${name}Err`]: warn
    })
    console.log(`Selected: ${ value}`)
  }

  handleIntChange = (event, {name, value, min, max, required}) => {
    //in case of an error keep empty string for React controlled component
    const intValue = parseInt(value, 10) || (parseInt(value, 10) === 0 ? 0 : '')
    //style input as warning if value is not appropriate
    const warn = (intValue === '' && !required) ? false : (intValue < min || max < intValue)
    this.setState({
      [name]: intValue,
      [`${name}Err`]: warn
    })
  }

  changeStatus = (e, {name}) => {
    e.preventDefault()
    e.stopPropagation()
    const curVal = this.state[name]
    // reset statuses
    this.setState({
      hasDefect: false,
      isSpoiled: false
    })
    // if supposed, activate status
    if (!curVal) {
      this.setState({ [name]: true })
    }
  }

  confirm = () => {
    const mode = this.props.mode

    //VALIDATION
    const requiredFields = (mode === 'create') ?
      ['deptId', 'modelId', 'melt', 'number', 'year'] :
      ['melt', 'number', 'year']
    let shouldExit = false
    //check for empty required fields and setting corresponding errors
    this.setState(Object.assign(...requiredFields.map(field => {
      if (this.state[field] === '') {
        shouldExit = true
        return ({[`${field}Err`]: true})
      }
      return false
    })))
    //check for other Form errors
    requiredFields.forEach((field) => {
      if (this.state[`${field}Err`]) { shouldExit = true }
    })
    //terminate if validation failed
    if (shouldExit) {return null}

    const { id, deptId, modelId, melt, number, year } = this.state
    const meltShift = this.state.meltShift || null
    const progress = this.state.progress || null
    const hasDefect = this.state.hasDefect || null
    const isSpoiled = this.state.isSpoiled || null

    if (mode === 'create') {
      const createdById = localStorage.getItem(GC_USER_ID)
      console.log(createdById, deptId, modelId, melt, meltShift, number, year, progress, hasDefect, isSpoiled)
      this.props.createProdMutation ({
        variables: {
          createdById,
          deptId,
          modelId,
          melt,
          meltShift,
          number,
          year,
          progress,
          hasDefect,
          isSpoiled
        }
      })
    } else if (mode === 'edit') {
      const updatedById = localStorage.getItem(GC_USER_ID)
      const prodId = id
      console.log(prodId, updatedById, melt, meltShift, number, year, progress, hasDefect, isSpoiled)
      this.props.updateProdMutation ({
        variables: {
          prodId,
          updatedById,
          melt,
          meltShift,
          number,
          year,
          progress,
          hasDefect,
          isSpoiled
        }
      })
    }
    this.close()
  }

  render() {
    const { open, deptId, modelId, melt, meltShift, number, year, progress, hasDefect, isSpoiled, deptIdErr, modelIdErr, meltErr, meltShiftErr, numberErr, yearErr, progressErr } = this.state
    const { prod, trigger, mode } = this.props
    let deptOptions = [{ text: 'Участок ', value: '' }]
    let modelOptions = [{ text: 'Вид продукции', value: '' }]

    if (mode === 'create') {
      const query = this.props.allDeptsAndModelsQuery
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
          <Form onSubmit={() => this.confirm()}>
            { (mode === 'create') &&
              <Form.Select label='Участок' name='deptId' options={deptOptions} onChange={this.handleSelChange} value={deptId} error={deptIdErr} required />
            }
            { (mode === 'create') &&
              <Form.Select label='Вид продукции' name='modelId' options={modelOptions} onChange={this.handleSelChange} value={modelId} error={modelIdErr} required />
            }
            <Form.Group widths='equal'>
              <Form.Input label='Плавка' placeholder='Плавка' required
                name='melt' type='number' min='0' max='999' error={meltErr}
                onChange={this.handleIntChange} value={melt}/>
              <Form.Input label='Плав. смена (если промаркирована)' placeholder='Пл. смена'
                name='meltShift' type='number' min='0' max='3' error={meltShiftErr}
                onChange={this.handleIntChange} value={meltShift}/>
              <Form.Input label='Номер' placeholder='Номер' required
                name='number' type='number' min='1' max='999' error={numberErr}
                onChange={this.handleIntChange} value={number}/>
              <Form.Input label='Год' placeholder='Год' required
                name='year' type='number' min='16' max='18' error={yearErr}
                onChange={this.handleIntChange} value={year}/>
            </Form.Group>
            <Form.Input label='Процент завершения' placeholder='%'
              name='progress' type='number' min='0' max='100' error={progressErr}
              onChange={this.handleIntChange} value={progress}/>
            <Form.Field>
              <label>Наличие дефектов</label>
              <Button.Group>
                <Button name='hasDefect'
                  active={hasDefect || null}
                  color={hasDefect ? 'orange' : null}
                  onClick={this.changeStatus}
                >Отклонение</Button>
                <Button name='isSpoiled'
                  active={isSpoiled || null}
                  color={isSpoiled ? 'red' : null}
                  onClick={this.changeStatus}
                >Брак</Button>
              </Button.Group>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.close} color='red'>
            <Icon name='remove' /> Отмена
          </Button>
          <Button onClick={this.confirm}>
            <Icon name='checkmark' /> {mode === 'create' ? 'Добавить' : 'Сохранить'}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default compose(
  graphql(allDeptsAndModelsQuery, { name: 'allDeptsAndModelsQuery' }),
  graphql(createProdMutation, {
    name: 'createProdMutation',
    options: {
      refetchQueries: ['allDeptsQuery']
    }
  }),
  graphql(updateProdMutation, { 
    name: 'updateProdMutation',
    options: {
      refetchQueries: ['allDeptsQuery']
    }
  })
)(CRUProdModal)
