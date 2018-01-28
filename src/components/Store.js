import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import _ from 'lodash'

import NavBar from './NavBar'
import DeptList from './DeptList'
import DataLoadErrorMessage from './messages/DataLoadErrorMessage'

const allDeptsQuery = gql`
  query allDeptsQuery {
    allDepts (orderBy: type_ASC) {
      id
      name
      type
      _prodsMeta {
       count
      }
      deptModels {
        id
        model {
          id
          name
        }
        allProds: _prodsMeta {
          count
        }
        prodsReady: _prodsMeta(filter: {
         progress: 100
        }) {
          count
        }
        prodsDefect: _prodsMeta(filter: {
         hasDefect: true
        }) {
          count
        }
        prodsSpoiled: _prodsMeta(filter: {
         isSpoiled: true
        }) {
         count
        }
        prods {
          id
          fullnumber
          isSpoiled
          hasDefect
          progress
          note
        }
      }
    }
  }
`

const moveProds = gql`
  mutation moveProds ( $to: ID!, $prodIds: [ID!]!) {
    moveProds (
      to: $to,
      prodIds: $prodIds
    ) { success }
  }
`

class Store extends Component {
  componentDidMount () {
    console.log('componentDidMount > ')
  }
  componentWillReceiveProps (nextProps) {
    console.log('props > '+ this.props.user)
    console.log('nextProps > '+ nextProps.user)
  }

  state={
    // List of selected products to move
    selectedProds: []
  }
  selectProd = (prodId) => {
    const { selectedProds } = this.state
    const newList = _.includes(selectedProds, prodId) ? _.without(selectedProds, prodId) : [...selectedProds, prodId]
    this.setState({ selectedProds: newList })
  }
  moveProds = async (deptId) => {
    const { selectedProds } = this.state
    const result = await this.props.moveProds({
     variables: {
       to: deptId,
       prodIds: selectedProds
     }
    })
    console.log(result)
  }

  render() {

    const userId = this.props.user

    // const query = this.props.allDeptsQuery
    const { allDeptsQuery: { loading, networkStatus, error, allDepts } } = this.props;

    // let depts = []

    // if ( === 7) {
    //   this.setState({sDepts: allDepts})
    // }

    // if (query && query.allDepts) {
    //   this.setState({sDepts: query.allDepts})
    //   console.log(this.state.deptsState)
      // deptsClone = query.allDepts.map(dept => Object.assign(dept, {selected: false}))
      // const deptsClone = _.cloneDeep(query.allDepts)
      // console.log(deptsClone)
    // }

    return (
      <div>
        <NavBar user={this.props.user} moveProds={this.moveProds} />
        {/* {networkStatus} */}
        { !userId ? (null) :
          loading ? <div>Загрузка</div> :
          error ? <DataLoadErrorMessage dataTitle='DeptList' /> :
          <DeptList depts={allDepts} selectProd={this.selectProd} />
        }
      </div>
    )
  }

}

export default compose (
  graphql( allDeptsQuery, {
    name: 'allDeptsQuery',
    options: { notifyOnNetworkStatusChange: true }
  }),
  graphql( moveProds, { name: 'moveProds' })
) (Store)
