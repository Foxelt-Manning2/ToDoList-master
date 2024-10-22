import { useState, useRef, useEffect } from 'react'

function ToDoList () {

// creating variables to track sstates
  const [showCompleted, setShowCompleted] = useState(false);
  const [newTasks, setNewTasks] = useState('');
 
// initializing task state variable so that is initialized with the values from local Storage
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks')
    return storedTasks ? JSON.parse(storedTasks) : []
  });
 
 const [priority,setPriority] =useState('')
 const [description,setDescription] =useState('');
 const [dateTime,setDateTime] =useState('');

// initializing complete  state variable so that it takes vallue from local storage or creates it 
  const [complete, setComplete] = useState(() => {
    const completedTasks = localStorage.getItem('Completed Task')
    return completedTasks ? JSON.parse(completedTasks) : []
  })

// creating a toggle to switch between completed tasks and pending tasks
  const [toggleCompleted, setToggleCompleted] = useState(false)
  const taskRef = useRef([])

// displays tasks as page loads and whenever tasks changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])


// displays completed tasks as page loads and whenever completed tasks changes
  useEffect(() => {
    localStorage.setItem('Completed Task', JSON.stringify(complete))
  }, [complete])



function timeDisplay(dateTime){
  const time = new Date(dateTime);
  const day = time.getDate();
  let Shour =time.getHours();
  const Smonth = time.toLocaleString("default",{month:'long'})
  const min = time.getMinutes();
  const year = time.getFullYear();
 const hour = Shour %12 || 12
  const meridian = hour >=12 ? "PM":"AM"

  return `${day} ${Smonth}, ${year} ${padZero(hour)}:${padZero(min)} ${meridian}`
}
function padZero(number){
  return (number <10 ? "0":"") +number
}

// function handles input button
  function handleInput (e) {
    const tasked = e.target.value;
    setNewTasks(tasked)
  }

  function handlePriority(e){
    setPriority(e.target.value);
  }
  function handleDateTime(e){
    setDateTime(e.target.value);
  }
  function handleDescription(e){
    setDescription(e.target.value)
  }
// function creates tasks
  function createTask () {
    if (newTasks !== ''&& priority !=="" && dateTime !=="" && description !=="") {
      console.log(tasks)
      setTasks(c => [...c, {
        task:newTasks,
        priority:priority,
        description:description,
        Duetime:dateTime,
        timeCreated:new Date()
      }])
      setNewTasks('');
      setDateTime("")
      setDescription("")
      setPriority("")
      console.log(tasks)
    } else {
      alert('please fill all fields')
    }
  }

// Enables the edit button operability
  function updateTask (index) {
    const updatedTask = prompt('Edit task', tasks[index])

    setTasks(preTasks =>
      preTasks.map((task, i) => (i === index ? updatedTask : task.task))
    )
  }


// enables the delete button and functionality
  function deleteTask (index) {
    setTasks(tasks.filter((_, i) => i !== index))
  }

//Enables complete task delete
  function deleteCompleted (index) {
    setComplete(complete.filter((_, i) => i !== index))
  }


 // Enables  task to be the  set as completed and saved 
  function completedTask (index,task) {
    console.log(task)
    const taskInQuestion = taskRef.current[index].value
    console.log(taskInQuestion)
    if (!complete.includes(tasks[index])) {
      // taskInQuestion.style.textDecoration = 'line-through'
      console.log(tasks[index])
     setComplete(c => [...c, tasks[index]]);
        // setTasks(task)
        deleteTask(index)
        // addToCompletedTasks(task)
    } 
  }



 // With the help of the toggle it enables the user to see both completed tasks and pending ones
  function ShowCompletedPending () {
    setShowCompleted(!showCompleted)
    setToggleCompleted(c => !c)
  }

  // serves as the component that changes the text after the toggle occurs
  const show = toggleCompleted ? 'Show Pending Tasks ⚠️' : 'Show Completed Tasks 📔'

  return (
    <> 
    {/* toggle logic */}
     
      {!showCompleted ? (
        <div
          className='text-center text-amber-950 font-sans font-bold text-2xl top-1/2 left-1/2 float-right w-3/4'
          style={{ transform: 'translate(-50,-50)' }}
          id='NewTaskArea'
        >
          <div className='text-7xl m-36 text-blue-600'> To Do list</div>
          <div className='bg-yellow-500 border-2 border-sky-300 my-4  m-3 hover:select-none rounded-xl'>
           {/* input button  */}
          <input 
          placeholder='Enter title description'
          value={description}
          onChange={(e)=>handleDescription(e)}
            className="my-3 border-2 border-blue-500 border-solid rounded-lg w-3/4"
          
          />
          <br/>
         
          {/* textarea button  */}
          <textarea
            placeholder='Enter task'
            value={newTasks}
            onChange={handleInput}
            id='newTask'
            className='border-4 border-solid border-black w-3/4 '
          /><br/>

           <select 
           onChange={(e)=>handlePriority(e)}
           value={priority}
            className="my-3 border-2 border-blue-500 border-solid rounded-lg w-3/4"
           >
          <option value="">Please set task priority</option>
            <option value="🟢 🌼">Low  - 🟢</option>
            <option value="🟡 📌">Moderate - 🟡</option>
            <option value="🚨 🔴">High - 🚨🔴</option>
          </select><br/>
          <p>Deadline</p>
           <input 
           type="datetime-local"
            onChange={(e)=>handleDateTime(e)}
            className="my-3 border-2 border-blue-500 border-solid rounded-lg w-3/4"
            value={dateTime}/><br/>
          {/* Create task button */}
          <button
            className='mx-3 my-6 border-1 border-white rounded-lg border-solid bg-red-600'
            onClick={createTask}
            >
            {' '}
           ➕  Add Task  .
          </button>
            </div>
          {/* task list */}
          <div className='my-10'>
            <ul>
            {tasks.map((task, index) => (
              <li key={index}
                className=' break-words whitespace-normal border-2 border-sky-300 my-4 bg-amber-600 m-3 hover:select-none rounded-xl flex flex-col'
              >
                <section  className='my-3 relative  '>
                  <h1
                  className='text-3xl bg-gray-700'>
                    {task.description}
                  <p className='float-right mx-0'   >{task.priority}</p><br/>
                  </h1>
                 <span
                    ref={el => (taskRef.current[index] = el)}
                    className='my-2 float-left text-xl'
                 > 
                    {task.task}
                  </span>
               </section>
             
                <div >
                  <button
                    className='deleteBtn border-2 border-solid my-10 mx-3 bg-purple-900 hover:bg-purple-500 hover:select-none'
                    onClick={() => deleteTask(index)}
                  >
                    🗑️
                  </button>
                  <button
                    className='complete my-10 mx-3.5 border-2 border-solid bg-yellow-500 hover:bg-yellow-600 hover:select-none'
                    onClick={() => completedTask(index,task)}
                  >
                    ✔️
                  </button>
                  <button
                    className='updated my-10 mx-3.5 border-2 border-solid bg-blue-700 hover:bg-blue-400 hover:select-none'
                    id='up'
                    onClick={() => updateTask(index)}
                  >
                    ✏️
                  </button>
                </div>
                <p  className='float-right relative border-2 border-white border-solid '>Due By  {timeDisplay(task.Duetime)} </p>
              </li>
            ))}
              </ul>
          </div>
        </div>
      ) : (
        <div
          className='text-center text-amber-950 font-sans font-bold text-2xl top-1/2 left-1/2 float-right w-3/4'
          style={{ transform: 'translate(-50,-50)' }}
          id='CompletedTaskArea'
        >
          <div className='text-7xl m-36 text-blue-600'> Completed Tasks</div>
          <ol>
            {complete.map((completed, index) => (
              <li key={index}
              className=' break-words whitespace-normal border-2 border-sky-300 my-4 bg-amber-600 m-3 hover:select-none rounded-xl flex flex-col'
            > <section>

              <section  className='my-3 relative '>
                <h1
                className='text-3xl bg-gray-700'>
                  {completed.description}
                <p className='float-right'   >{completed.priority}</p><br/>
                </h1>
               <span
                  ref={el => (taskRef.current[index] = el)}
                  className='my-2 text-left float-left text-white'
                  > 
                  {completed.task}
                </span><br/>
             </section>
                  </section>
           
              
                <button
                  className='deleteBtn border-2 border-solid my-6 mx-3 bg-purple-900 hover:bg-purple-500 hover:select-none'
                  onClick={() => deleteCompleted(index)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Dashboard */}
      <aside className=' top-0 left-0 fixed w-3/12 bg-green-800 h-screen rounded-lg'>
        <div className=' font-mono font-bold text-4xl bg-green-600  break-words whitespace-normal '>
          Dashboard
        </div>
        <p
          className=' my-3 text-white hover:bg-blue-500 text-3xl hover:border-2 hover:border-solid hover:select-none rounded-lg break-words whitespace-normal'
          onClick={() => ShowCompletedPending()}
         > {/*toggle content*/}

          {' '}
          {show}
        </p>
      </aside>
    </>
  )
}
export default ToDoList
