import React, { Component } from 'react'
import _ from 'lodash'
import { Accordion, Segment, Icon, Label, Header } from 'semantic-ui-react'
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

    const deptModels = this.props.deptModels.map((deptModel, i) => {
      const allProdsCount = deptModel.allProds.count
      const prodsReadyCount = deptModel.prodsReady.count
      const prodsDefectCount = deptModel.prodsDefect.count
      const prodsSpoiledCount = deptModel.prodsSpoiled.count
      const prodsInProgressCount = allProdsCount - prodsReadyCount - prodsDefectCount - prodsSpoiledCount

      const active = _.includes(activeIndex, i)

      return (
      <div key={deptModel.id} >
        <Accordion.Title
          active={active}
          index={i}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          <Header size='small' as='span'>{deptModel.model.name}
            <Label color='grey'>
              {allProdsCount}
              <Label.Detail>шт</Label.Detail>
            </Label>
          </Header>
          <Label.Group className='komz-ml-21px'>
            { (prodsReadyCount > 0) &&
              <Label basic>
                <Icon name='checkmark' color='green' />
                {prodsReadyCount}
                <Label.Detail>ГП</Label.Detail>
              </Label>
            }
            { (prodsInProgressCount > 0) &&
              <Label basic>
                {prodsInProgressCount}
                <Label.Detail>НЗП</Label.Detail>
              </Label>
            }
            { (prodsDefectCount > 0) &&
              <Label basic>
                <Icon name='warning sign' color='orange' />
                {prodsDefectCount}
                <Label.Detail>ОТКЛОН</Label.Detail>
              </Label>
            }
            { (prodsSpoiledCount > 0) &&
              <Label basic>
                <Icon name='broken chain' color='red' />
                {prodsSpoiledCount}
                <Label.Detail>БРАК</Label.Detail>
              </Label>
            }
          </Label.Group>
        </Accordion.Title>
        { active &&
          <Accordion.Content active>
            <ProdList prods={deptModel.prods} selectProd={this.props.selectProd}/>
          </Accordion.Content>
        }
      </div>
    )})

    return (
      <Accordion>
        {deptModels}
      </Accordion>
    )
  }
}

export default ModelList
