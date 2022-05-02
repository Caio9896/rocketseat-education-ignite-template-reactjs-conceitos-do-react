import { render } from 'react-dom'

import { App } from './App'

import { createServer, Model } from 'miragejs';

//* passa uma requisição fake usando a lib 'miragejs'
createServer({

  models: {
    task: Model,
  },

  seeds(server) {
    server.db.loadData({
      tasks: [
        // tasks seram adicionadas aqui
      ],
    })
  },



  routes() {
    this.namespace = 'api';

    this.get('/tasks', () => {
      return this.schema.all('task')
    })

    this.post('/tasks', (schema, request) => {
      const data = JSON.parse(request.requestBody)
      return schema.create('task', data)
    })

    this.patch('/tasks', (schema, request) => {
      const data = JSON.parse(request.requestBody)
      schema.findBy('task', {id: data.id })?.update({isComplete: data.isComplete})
     
      return this.schema.all('task')
    })

    this.delete('/tasks', (schema, request) => {
      const data = JSON.parse(request.requestBody)
      schema.findBy('task', { id: data.id })?.destroy()

      return this.schema.all('task')
    })
  }
})
//*

render(<App />, document.getElementById('root'))