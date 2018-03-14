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
          melt
          meltShift
          number
          year
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
  // componentDidMount () {
  //   console.log('componentDidMount > ')
  // }
  // componentWillReceiveProps (nextProps) {
  //   console.log('props > '+ this.props.user)
  //   console.log('nextProps > '+ nextProps.user)
  // }

  state={
    // List of selected products to move
    selectedProds: [],
    // List of filtered Depts
    visibleDeptTypes: ['OWNED', 'TRANSPORT']
  }
  selectProd = (prodId) => {
    const { selectedProds } = this.state
    const newList = _.includes(selectedProds, prodId) ? _.without(selectedProds, prodId) : [...selectedProds, prodId]
    this.setState({ selectedProds: newList })
  }
  filterDeptType = (type) => {
    const {visibleDeptTypes} = this.state
    const newList = _.includes(visibleDeptTypes, type) ? _.without(visibleDeptTypes, type) : [...visibleDeptTypes, type]
    this.setState({ visibleDeptTypes: newList })
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
    const {visibleDeptTypes} = this.state

    const { allDeptsQuery: { loading, networkStatus, error, allDepts } } = this.props;

    return (
      <div>
        <NavBar user={this.props.user} moveProds={this.moveProds} filterDeptType={this.filterDeptType} />
        {/* {networkStatus} */}
        { !userId ? (null) :
          loading ? <div>Загрузка</div> :
          error ? <DataLoadErrorMessage dataTitle='DeptList' /> :
          <DeptList
            depts={allDepts.filter(dept => _.includes(visibleDeptTypes, dept.type) ? true : false)}
            selectProd={this.selectProd}
          />
        }
      </div>
    )
  }

}

export default compose (
  graphql( allDeptsQuery, {
    name: 'allDeptsQuery'
    // options: { notifyOnNetworkStatusChange: true }
  }),
  graphql( moveProds, {
    name: 'moveProds',
    options: {
      refetchQueries: ['allDeptsQuery']
    }
  })
) (Store)
