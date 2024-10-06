import React, { useState } from 'react'
import styles from "./Tasks.module.css"
import {v4} from "uuid"
import DatePicker from "react-multi-date-picker"
import { Calendar } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import InputIcon from "react-multi-date-picker/components/input_icon";



function Tasks() {
    const[task,setTask]=useState("")
    // const[date,setDate]=useState("")
    let [date, setDate] = useState(new Date())
    const [userInfo, setUserInfo] = useState(null);
    const [selectedDate, setSelectedDate] = useState([]);
    const[showAlert,setShowAlert]=useState("")
    const[todo,setTodo]=useState({id:"",task,date:"",completed:false,actions:""})
    const [todos,setTodos]=useState(JSON.parse(localStorage.getItem("todos"))|| [])
    const[edit,setEdit]=useState(false)
    const[add,setAdd]=useState(true)
    const[id,setId]=useState("")

        
     const success="!باموفقیت افزوده شد"
     const alert="!تسکی وارد نشده است"

     const saveToLocalStorage=()=>{
        localStorage.setItem("todos",JSON.stringify(todos))

     }
    

    const filterHandler=(event)=>{
       let filteredTodos=null;
        const filter=event.target.dataset.filter;
        console.log(filter)
        switch (filter) {
            case "pending":
                filteredTodos=todos.filter((todo)=>todo.completed===false)
                break;
          
                
            case "completed":
                filteredTodos=todos.filter((todo)=>todo.completed===true)
                break;

        
            default:
                filteredTodos=todos;
                break;
               
        }
        console.log(filteredTodos)
        console.log(todos)
        saveToLocalStorage()
        setTodos(filteredTodos)
   
    }



    const applyEditHandler=(event)=>{
        // console.log(task.todo.id)
   const todo=todos.find((todo)=>todo.id===id)
   todo.task=task;
   todo.date=date;
   saveToLocalStorage()
  setTask("");
//   setDate("")
  setEdit(false);
  setAdd(true);

  
}


    const editHandler=(id)=>{
        const todo=todos.find((todo)=>todo.id===id)
        setId(todo.id)
        setTask(todo.task)
        setDate(todo.date)
        setEdit(true)
        setAdd(false)
  
    }


    const toggleHandler=(id)=>{
      const newTodos=todos.map((todo)=>{
        if(todo.id===id){
            return {
                id:todo.id,
                task:todo.task,
                date:todo.date,
                completed:!todo.completed
            }
        }
        else{
            return todo
        }
      })
      setTodos(newTodos)
     
    }

    const deleteAllHandler=()=>{
        setTodos([])

    }

    const deleteHandler=(id)=>{
      const newTodos=todos.filter((todo)=>todo.id!==id)
       console.log(newTodos)
       setTodos([...newTodos])

    }
    

    const addHandler=()=>{
        if(task){
            const jalali_date = date ? date.toString() : null;
            todos.push({...todo,id:v4(),task,date:jalali_date})
            saveToLocalStorage()
            console.log(todos)
            console.log(todo.task)
         
            setTask("")
 
            setShowAlert(success)
        
        }
        else{
            setShowAlert(alert)
        }

    }


  return (
    <>
    <div className={styles.header}>
        <h1>تسک ها</h1>
        <div className={styles.inputssection}>

        <input type='text' placeholder='لطفا تسک خود را وارد کنید' value={task} onChange={(e)=>setTask(e.target.value)} />
        < DatePicker className={styles.datepicker}
        format="YY/MM/DD"
        name="jalali_date"
        render={<InputIcon />}
        calendar={persian}
        locale={persian_fa}
        value={date}
        calendarPosition="bottom-center"
        mapDays={({ date }) => {
          let props = {}
          let isWeekend = date.weekDay.index === 6
          if (isWeekend) props.className = "highlight highlight-red"
          return props
        }}
       
     onChange={setDate}/>
         {/* <button onClick={handleSubmit}>submit</button> */}
        {!!edit && <button onClick={()=>applyEditHandler(`${todo.id}`)}>ویرایش</button>}
        {!!add && <button onClick={addHandler}>افزودن</button>}

        </div>

      
        <div className={styles.buttons}>
        <div >
            <button onClick={filterHandler} data-filter="all">همه</button>
            <button onClick={filterHandler} data-filter="pending">درحال انجام</button>
            <button onClick={filterHandler} data-filter="completed">تکمیل شده</button>
    
        </div>
        <button onClick={deleteAllHandler}>حذف همه</button>

        </div>
    </div>


    {!!showAlert && <p className={showAlert==success ? styles.success : styles.error}>{showAlert}</p>}
    <div className={styles.table}> 
        <table>
            <thead>
                <tr>
                    <th>تسک</th>
                    <th>تاریخ</th>
                    <th>وضعیت</th>
                    <th>موارد</th>
                </tr>

            </thead>
            <tbody>
               {/* {!todos.length && <tr><td colSpan="4">لطفا تسک خود را وارد کنید</td></tr>} */}
               {todos.map((todo)=>
               <tr key={todo.id}>
                <td>{todo.task}</td>
                <td>{todo.date || "No date"}</td>
                <td>{todo.completed ? "انجام شده" : "درحال انجام"}</td>
                <td>
                    <button onClick={()=>editHandler(`${todo.id}`)}>ویرایش</button>
                    <button onClick={()=>toggleHandler(`${todo.id}`)}>{todo.completed ?"در حال انجام" : "انجام شده"}</button>
                    <button onClick={()=>deleteHandler(`${todo.id}`)}>حذف</button>
                </td>

               </tr>
            )}

            </tbody>

        </table>

    </div>
    </>
  )
}

export default Tasks