var fetch = require("isomorphic-fetch")

module.exports = (event) => {
 	var from = event.data.from
 	var to = event.data.to
 	var prodIds = event.data.prodIds

	console.log(from)
	console.log(to)
	console.log(prodIds)

    var API = 'https://api.graph.cool/simple/v1/cjbuug4g90oz80127p4yshxxf'
    var fetchConf = (queryString) => ({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': ''
        },
        body: JSON.stringify({ query: queryString })
    })

    var exec = (query) => {
      return fetch(API, fetchConf(query))
        .then((resp) => resp.json())
        .then((data) => { console.log(data) })
        .catch((err) => { console.log(err) })
    }

    var move = (id) => {
      console.log(id)
      var MoveProd = `
        mutation {
          updateProd (
            id:"${id}"
            to: "${to}"
            updTrigger: true
          ) {
            id
          }
        }
      `
      console.log(MoveProd)
      exec(MoveProd)
    }

  	prodIds.forEach(move)

  	return {
      	data: {
      		success: true,
		},
	}
}
