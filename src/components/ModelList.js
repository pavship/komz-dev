import React, { Component } from 'react'

import { Accordion } from 'semantic-ui-react'
import ProdList from './ProdList'

class ModelList extends Component {
  render() {

    const deptModels = this.props.deptModels

    return (
        <Accordion exclusive={false} styled
          panels={
            (deptModels.map((deptModel, index) => ({
              title: deptModel.model.name + ' ('+deptModel._prodsMeta.count+')',
              content: {
                content: (<ProdList prods={deptModel.prods} selectProd={this.props.selectProd}/>),
                key: deptModel.id
              }
            })))
          }
          ></Accordion>
    )
  }
}

export default ModelList
