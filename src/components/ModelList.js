import React, { Component } from 'react'
import _ from 'lodash'

import { Accordion, Segment, Icon } from 'semantic-ui-react'
import ProdList from './ProdList'

class ModelList extends Component {

  state = { activeIndex: [] }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = _.includes(activeIndex, index) ? _.without(activeIndex, index) : [...activeIndex, index]

    this.setState({ activeIndex: newIndex })
  }

  render() {

    const { activeIndex } = this.state

    const deptModels = this.props.deptModels.map((deptModel, i) => (
      <div key={deptModel.id} >
        <Accordion.Title
          active={_.includes(activeIndex, i)}
          index={i}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          {deptModel.model.name + ' ('+deptModel._prodsMeta.count+')'}
        </Accordion.Title>
        <Accordion.Content active={_.includes(activeIndex, i)}>
          <ProdList prods={deptModel.prods} selectProd={this.props.selectProd}/>
        </Accordion.Content>
      </div>
    ))

    return (
      <Accordion>
        {deptModels}
      </Accordion>
    )
  }
}

export default ModelList
