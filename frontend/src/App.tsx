import { useEffect, useState } from 'react'
import './App.css'

type Task = {
  id: number,
  title: string,
  content: string,
}

function App() {
  // Store task list and how notes are updated
  const [tasks, setTasks] = useState<Task[]>([])

  // Store task data and how that data changes
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function fetchTasks(): Promise<Task[]> {
    const res = await fetch('http://localhost:3000/tasks')
    const data = await res.json()
    return data
  }

  async function createTask() {
    await fetch('http://localhost:3000/tasks', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    setTitle("");
    setContent("");

    setTasks(await fetchTasks())
  }

  useEffect(() => {
    let ignore = false

    async function loadTasks() {
      const data = await fetchTasks()

      if (!ignore) {
        setTasks(data)
      }
    }

    void loadTasks()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main>
      <div>
        <h1>Todo App</h1>
        <div>
          <input
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <br />

          <textarea placeholder='Content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <br />

          <button onClick={() => void createTask()}>
            Add Note
          </button>
        </div>
      
        <hr />
      
        <div></div>
        {tasks.map((task) => (
          <div key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
