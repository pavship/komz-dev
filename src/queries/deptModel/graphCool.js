------------------------------------------------------------------------------
subscription {
  Prod(filter: {
    mutation_in: [CREATED, UPDATED]
  }) {
    mutation
    node {
      id
      dept {
        id
      }
      model {
        id
      }
    }
  }
}
CODE--------------------------------------------------------------------------
var fetch = require("isomorphic-fetch")

module.exports = (event) => {

  var prod = event.data.Prod.node
  var deptModelId = ''

  var FindDeptModel = `
    query {
      allDeptModels (filter: {
        dept: {
            id: "${prod.dept.id}"
        }
        model: {
            id: "${prod.model.id}"
        }
      }) {
          id
      }
    }
  `

  var CreateDeptModel = `
    mutation {
      createDeptModel (
		deptId: "${prod.dept.id}",
		modelId: "${prod.model.id}",
		prodsIds: "${[prod.id]}"
		) {
		id
      }
    }
  `

  var AddToDeptModel = (deptModelId) => `
     mutation {
      addToDeptModelOnProd (
    deptmodelDeptModelId: "${deptModelId}",
    prodsProdId: "${prod.id}"
      ) {
        deptmodelDeptModel {
            id
        }
        prodsProd {
          id
        }
      }
    }
  `

  var API = 'https://api.graph.cool/simple/v1/cjbuug4g90oz80127p4yshxxf'
  var fetchConf = (queryString) => ({
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': ''
          },
          body: JSON.stringify({ query: queryString })
    	})

  return fetch(API, fetchConf(FindDeptModel))
    .then((resp) => resp.json())
    .then((data) => {
    	var deptModels = data.data.allDeptModels
      if (deptModels.length) {
        deptModelId = deptModels[0].id
        return fetch(API, fetchConf(AddToDeptModel(deptModels[0].id)))
          .then((resp) => resp.json())
          .then((data) => {
            console.log(`prod ${prod.id} was added to deptModel ${deptModelId}`)
            return
          }).catch((err) => { console.log(err) })
        return
      } else {
        return fetch(API, fetchConf(CreateDeptModel))
          .then((resp) => resp.json())
          .then((data) => {
          	deptModelId = data.data.createDeptModel.id
            console.log(`deptModel ${deptModelId} was created with prod ${prod.id} `)
            return
          }).catch((err) => { console.log(err) })
      }
    }).catch((err) => { console.log(err) })

}
