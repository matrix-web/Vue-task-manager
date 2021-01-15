import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: JSON.parse(localStorage.getItem('taskList') || '[]').map(task => {
      if (task && task.date) {
        if (new Date(task.date) < new Date() && task.status !== 'complete') {
          task.status = 'outdated'
        }

        return task
      }
    })
  },
  mutations: {
    createTask(state, task) {
      state.tasks.unshift(task)

      localStorage.setItem('taskList', JSON.stringify(state.tasks))
    },
    updateTask(state, {id, title, description, date}) {
      const idx = state.tasks.findIndex(task => task.id === id)
      const status = new Date(date) > new Date() ? 'active' : 'outdated'
      const updatedTask = {...state.tasks[idx], title, date, description, status}

      state.tasks[idx] = updatedTask

      localStorage.setItem('taskList', JSON.stringify(state.tasks))
    },
    completeTask(state, id) {
      const idx = state.tasks.findIndex(task => task.id === id)

      delete state.tasks[idx].statusClass
      state.tasks[idx].status = 'complete'
      
      localStorage.setItem('taskList', JSON.stringify(state.tasks))
    },
    removeTask(state, id) {
      const idx = state.tasks.findIndex(task => task.id === id)
      state.tasks.splice(idx, 1)

      localStorage.setItem('taskList', JSON.stringify(state.tasks))
    }
  },
  actions: {
    createTask({commit}, task) {
      commit('createTask', task)
    },
    updateTask({commit}, task) {
      commit('updateTask', task)
    },
    completeTask({commit}, id) {
      commit('completeTask', id)
    },
    removeTask({commit}, id) {
      commit('removeTask', id)
    }
  },
  getters: {
    tasks: s => s.tasks,
    taskById: s => id => s.tasks.find(task => task.id === id)
  }
})