import React, {useState, useEffect} from 'react';
import './App.css';
import {AiOutlineDelete, AiOutlineEdit} from 'react-icons/ai';
import {BsCheckLg} from 'react-icons/bs';

function App () {
  // states
  const [isCompleteScreen, setIsCompleteScreen] = useState (false);
  const [allTodos, setTodos] = useState ([]);
  const [newTitle, setNewTitle] = useState ('');
  const [newDescription, setNewDescription] = useState ('');
  const [completedTodos, setCompletedTodos] = useState ([]);
  const [currentEdit,setCurrentEdit] = useState("");
  const [currentEditedItem,setCurrentEditedItem] = useState("");

  // hooks
  // handleAddTodo to add new item to todo list
  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };

    let updatedTodoArr = [...allTodos];
    // add new item to todo list
    updatedTodoArr.push (newTodoItem);
    // set new todo list
    setTodos (updatedTodoArr);
    // save to local storage
    localStorage.setItem ('todolist', JSON.stringify (updatedTodoArr));
  };

  // handleDeleteTodo to delete item from todo list
  const handleDeleteTodo = index => {
    // remove item from todo list
    let reducedTodo = [...allTodos];
    reducedTodo.splice (index);
    // save to local storage
    localStorage.setItem ('todolist', JSON.stringify (reducedTodo));
    setTodos (reducedTodo);
  };

  // handleComplete to mark item as completed
  const handleComplete = index => {
    // get current date and time
    let now = new Date ();
    let dd = now.getDate ();
    let mm = now.getMonth () + 1;
    let yyyy = now.getFullYear ();
    let h = now.getHours ();
    let m = now.getMinutes ();
    let s = now.getSeconds ();
    let completedOn =
      dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;
    // filter item from todo list
    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    // add item to completed list
    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push (filteredItem);
    // set completed list
    setCompletedTodos (updatedCompletedArr);
    // delete item from todo list
    handleDeleteTodo (index);
    // save to local storage
    localStorage.setItem (
      'completedTodos',
      JSON.stringify (updatedCompletedArr)
    );
  };

  // handleDeleteCompletedTodo to delete item from completed list
  const handleDeleteCompletedTodo = index => {
    // remove item from completed list
    let reducedTodo = [...completedTodos];
    reducedTodo.splice (index);

    // save to local storage
    localStorage.setItem ('completedTodos', JSON.stringify (reducedTodo));
    // set completed list
    setCompletedTodos (reducedTodo);
  };

  // get data from local storage (on refresh of page)
  useEffect (() => {
    // get data from local storage
    let savedTodo = JSON.parse (localStorage.getItem ('todolist'));
    let savedCompletedTodo = JSON.parse (
      localStorage.getItem ('completedTodos')
    );
    // set data to state (todos)
    if (savedTodo) {
      setTodos (savedTodo);
    }
    // set data to state (completed todos)
    if (savedCompletedTodo) {
      setCompletedTodos (savedCompletedTodo);
    }
  }, []);


  // handleEdit to edit item from todo list
  const handleEdit = (ind,item)=>{
    console.log(ind);
    // set current edit index and item
    setCurrentEdit(ind);
    // set current edited item
    setCurrentEditedItem(item);
  }

  // handleUpdateTitle to update title of item
  const handleUpdateTitle = (value)=>{
    setCurrentEditedItem((prev)=>{
      return {...prev,title:value}
    })
  }
  // handleUpdateDescription to update description of item
  const handleUpdateDescription = (value)=>{
    setCurrentEditedItem((prev)=>{
      return {...prev,description:value}
    })
  }

  // handleUpdateToDo to update item in todo list
  const handleUpdateToDo = ()=>{
      let newToDo = [...allTodos];
      // update item in todo list
      newToDo[currentEdit] = currentEditedItem;
      // save to local storage
      setTodos(newToDo);
      // set current edit to empty
      setCurrentEdit("");
  }

  return (
    <div className="App">
    {/* heading of page */}
      <h1>My Todos</h1>

      {/* main content of page */}
      <div className="todo-wrapper">
        {/* input container */}
        <div className="todo-input">
          {/* title input */}
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle (e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          {/* description input */}
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription (e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          {/* add button and handleAddToDo hook to add new item */}
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>
        {/* buttons - ToDo and Completed */}
        <div className="btn-area">
          {/* don't set active (to change background) is iscompleted is not selected, if clicked on this, then set complete screen to false*/}
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen (false)}
            >
            Todo
          </button>
          {/* set active (to change background) is iscompleted is not selected, if clicked on this then set complete screen to true */}
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen (true)}
          >
            Completed
          </button>
        </div>

        {/* to do items container */}
        <div className="todo-list">
          {/* show items of ToDo's if completeScreen is not selected or set to false */}
          {isCompleteScreen === false &&
            allTodos.map ((item, index) => {
              // map items of todo list
              // show editable inputs if currentEdit is equal to index else show the items in general form
              if(currentEdit===index){
                 return(
                  <div className='edit__wrapper' key={index}>
                    {/* title input */}
                  <input placeholder='Updated Title' 
                  onChange={(e)=>handleUpdateTitle(e.target.value)} 
                  value={currentEditedItem.title}  />
                  {/* description input (textarea) */}
                  <textarea placeholder='Updated Title' 
                  rows={4}
                  onChange={(e)=>handleUpdateDescription(e.target.value)} 
                  value={currentEditedItem.description}  />
                  {/* button to save update and handleUpdateToDo hook to update the item data */}
                   <button
              type="button"
              onClick={handleUpdateToDo}
              className="primaryBtn"
            >
              Update
            </button>
              </div> 
                 ) 
                //  return non editable items id editable is not triggered
              }else{
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    {/* action buttons delete, mark completed and edit */}
                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTodo (index)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleComplete (index)}
                        title="Complete?"
                      />
                      <AiOutlineEdit  className="check-icon"
                        onClick={() => handleEdit (index,item)}
                        title="Edit?" />
                    </div>
  
                  </div>
                );
              }
              
            })}
          {/* show completed items if completeScreen is selected or set to true */}
          {isCompleteScreen === true &&
            completedTodos.map ((item, index) => {
              return (
                // show completed items
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>
                  {/* only delete button to completed items */}
                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo (index)}
                      title="Delete?"
                    />
                  </div>

                </div>
              );
            })}

        </div>
      </div>
    </div>
  );
}
// export component
export default App;
