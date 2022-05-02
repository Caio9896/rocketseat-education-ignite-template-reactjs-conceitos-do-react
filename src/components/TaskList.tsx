import { useEffect, useState } from 'react'
import '../styles/tasklist.scss'

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
  
  useEffect(() => {
    api.get('/tasks').then(response => setTasks(response.data.tasks))
  }, []);

  async function handleCreateNewTask() {
     //Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    if(newTaskTitle === ''){
      alert('Preencha o campo "Adicionar Novo Todo"')
    } else {
      const response = await api.post('/tasks', {
        title: newTaskTitle,
        isComplete: false
      })

      setTasks([
        ...tasks,
        {
          id: response.data.task.id,
          title: response.data.task.title,
          isComplete: false
        }
      ])
    }
    setNewTaskTitle('');
  }

  async function handleToggleTaskCompletion(e: boolean, key: number) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    const response = await api.patch('/tasks', {
        id: key,
        isComplete: e
    })
    setTasks(response.data.tasks)
  }

  async function handleRemoveTask(key: number) {
    const response = await api.delete('/tasks', {
      data: {
        id: key
      }
    })
    setTasks(response.data.tasks)
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
            <FiCheckSquare size={16} color="#fff"/>
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
                    onChange={(e) => handleToggleTaskCompletion(e.target.checked, task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={(e) => handleRemoveTask(task.id)}>
                <FiTrash size={16}/>
              </button>
            </li>
          ))}
          
        </ul>
      </main>
    </section>
  )
}