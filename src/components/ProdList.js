import React, { Component } from 'react'

import { List } from 'semantic-ui-react'
import ProdItem from './ProdItem'

class ProdList extends Component {
  render() {

    const prods = this.props.prods

    // this.handleItemClick = (e, data) => {
    //   console.log(data)
    // }
    // onItemClick={this.handleItemClick}

    return (
      <List divided selection size='medium'>
        {prods.map((prod) => <ProdItem title={prod.fullnumber} key={prod.id} id={prod.id} selectProd={this.props.selectProd}/>)}
      </List>
    )
  }
}

export default ProdList
