import { useEffect, useState } from 'react'
import '../styles/tasklist.scss'
import _ from 'lodash'
import { FiTrash, FiCheckSquare } from 'react-icons/fi'
import { api } from '../services/api';


interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}


export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  /* Usar com miragejs
  useEffect(() => {
    api.get('/tasks').then(response => setTasks(response.data.tasks))
  }, []);
  */

  function handleCreateNewTask() {
    //Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    //para conexao com o miragejs
    /* const response = await api.post('/tasks', {
      title: newTaskTitle,
      isComplete: false
    })*/

    if (!newTaskTitle) {
      return
    } else {

      setTasks([
        ...tasks,
        {
          id: Math.random(),
          title: newTaskTitle,
          isComplete: false
        }
      ])
    }
    setNewTaskTitle('');
  }

  function handleToggleTaskCompletion(id: number) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    /*para conexao com o miragejs
    const response = await api.patch('/tasks', {
        id: key,
        isComplete: e
    })*/

    //se 'task === id' for igual a true retorna o objeto, senao retorno o proprio objeto
    const updatedTask = tasks.map(task => task.id === id ? {
      ...task,
      isComplete: !task.isComplete
    }: task)

    setTasks(updatedTask)

  }

  function handleRemoveTask(key: number) {
    //para conexao com o miragejs
    /*
    const response = await api.delete('/tasks', {
      data: {
        id: key
      }
    })*/

    const searchTasks = _.remove(tasks, (task) => {
      return task.id != key
    })
    setTasks(searchTasks)
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar novo todo"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />

          <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={(e) => handleRemoveTask(task.id)}>
                <FiTrash size={16} />
              </button>
            </li>
          ))}

        </ul>
      </main>
    </section>
  )
}