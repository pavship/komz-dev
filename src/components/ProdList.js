import React, { Component } from 'react'

import { List } from 'semantic-ui-react'
import ProdItem from './ProdItem'

class ProdList extends Component {
  render() {

    const prods = this.props.prods

    return (
      <List divided selection size='medium'>
        {prods.map((prod) => <ProdItem prod={prod} key={prod.id} selectProd={this.props.selectProd}/>)}
      </List>
    )
  }
}

export default ProdList
