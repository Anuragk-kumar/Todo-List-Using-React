/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import todoImage from "../image/todo.png";

/**
 * The TodoList function is a React component that manages a list of tasks, allows users to add and
 * edit tasks, and provides filtering options.
 */
const TodoList = () => {
  const [tasks, setTasks] = useState([]); // Holds the list of tasks
  const [inputValue, setInputValue] = useState(""); // Holds the value of the input field
  const [filter, setFilter] = useState("all"); // Holds the current filter type
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
  const [editTaskId, setEditTaskId] = useState(null); // Holds the ID of the task being edited

  // Fetch initial data
 /* The `useEffect` hook is used to perform side effects in a functional component. In this case, it is
 used to fetch initial data when the component is mounted. */
  useEffect(() => {
    fetchTodos();
  }, []);

/**
 * The function fetches a list of todos from a JSON API and sets the tasks state with the fetched data.
 */
  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=4"
      );
      const todos = await response.json();
      setTasks(todos);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching todos:", error);
      setIsLoading(false);
    }
  };


  // Handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Add a new task
  const handleAddTask = async () => {
    if (inputValue.trim() === "") {
      return;
    }

    const newTask = {
      title: inputValue,
      completed: false,
    };

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          body: JSON.stringify(newTask),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const addedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, addedTask]);
      setInputValue("");
      toast.success("Task added successfully");
    } catch (error) {
      console.log("Error adding task:", error);
      toast.error("Error adding task");
    }
  };

 /* The `handleTaskCheckboxChange` function is responsible for handling the change event when a task
 checkbox is clicked. It takes the `taskId` as a parameter and updates the `tasks` state by toggling
 the `completed` property of the task with the matching `taskId`. */
  const handleTaskCheckboxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /* The `handleDeleteTask` function is responsible for deleting a task from the list of tasks. It
  takes the `taskId` as a parameter and filters out the task with the matching `taskId` from the
  `tasks` state using the `filter` method. After deleting the task, it displays a success toast
  message. */
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    toast.success("Task deleted successfully");
  };

  /* The `handleEditTask` function is responsible for setting the `editTaskId` state to the `taskId`
  parameter and updating the `inputValue` state with the title of the task being edited. This
  function is called when the edit button is clicked for a specific task. */
  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setInputValue(taskToEdit.title);
  };

 /**
  * The handleUpdateTask function is used to update a task.
  */
  const handleUpdateTask = async () => {
    if (inputValue.trim() === "") {
      return;
    }

  /* The `updatedTask` constant is creating an object that represents the updated task. It contains the
  `title` property, which is set to the value of the `inputValue` state, and the `completed`
  property, which is set to `false`. This object is used to update the task when the
  `handleUpdateTask` function is called. */
    const updatedTask = {
      title: inputValue,
      completed: false,
    };

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${editTaskId}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedTask),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const updatedTaskData = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId
            ? { ...task, title: updatedTaskData.title }
            : task
        )
      );
      setInputValue("");
      setEditTaskId(null);
      toast.success("Task updated successfully");
    } catch (error) {
      console.log("Error updating task:", error);
      toast.error("Error updating task");
    }
  };

 /* The `handleCompleteAll` function is responsible for marking all tasks as completed. When called, it
 updates the `completed` property of all tasks in the `tasks` state to `true`. */
  const handleCompleteAll = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
    );
  };

  /* The `handleClearCompleted` function is responsible for deleting all completed tasks from the list
  of tasks. When called, it filters out the tasks with the `completed` property set to `true` from
  the `tasks` state using the `filter` method. This function is triggered when the "Delete comp
  tasks" button is clicked. */
  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

 /* The `handleFilterChange` function is responsible for updating the `filter` state based on the
 selected filter type. It takes the `filterType` parameter, which represents the selected filter
 type, and sets the `filter` state to the value of `filterType`. This function is called when a
 filter option is clicked in the dropdown menu. */
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

 
/* The `filteredTasks` constant is filtering the `tasks` array based on the selected filter type. It
uses the `filter` method to iterate over each task in the `tasks` array and returns a new array that
only includes tasks that match the filter condition. */
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") {
      return true;
    } else if (filter === "completed") {
      return task.completed;
    } else if (filter === "uncompleted") {
      return !task.completed;
    }
    return true;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Render the todo list
  return (
    <div className="container">
      <ToastContainer />
      <div className="todo-app">
        <h2>
          <img src={todoImage} alt="todo-img" /> Todo List
        </h2>
        <div className="row">
          <i className="fas fa-list-check"></i>
          <input
            type="text"
            className="add-task"
            id="add"
            placeholder="Add your todo"
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            id="btn"
            onClick={editTaskId ? handleUpdateTask : handleAddTask}
          >
            {editTaskId ? "Update" : "Add"}
          </button>
        </div>

        <div className="mid">
          <i className="fas fa-check-double"></i>
          <p id="complete-all" onClick={handleCompleteAll}>
            Complete all tasks
          </p>
          <p id="clear-all" onClick={handleClearCompleted}>
            Delete comp tasks
          </p>
        </div>

        <ul id="list">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                id={`task-${task.id}`}
                data-id={task.id}
                className="custom-checkbox"
                checked={task.completed}
                onChange={() => handleTaskCheckboxChange(task.id)}
              />
              <label htmlFor={`task-${task.id}`}>{task.title}</label>
              <div>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
                  alt=""
                  className="edit"
                  data-id={task.id}
                  onClick={() => handleEditTask(task.id)}
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                  alt=""
                  className="delete"
                  data-id={task.id}
                  onClick={() => handleDeleteTask(task.id)}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="filters">
          <div className="dropdown">
            <button className="dropbtn">Filter</button>
            <div className="dropdown-content">
              <a href="#" id="all" onClick={() => handleFilterChange('all')}>All</a>

              <a href="#" id="rem" onClick={() => handleFilterChange('uncompleted')}> Uncompleted</a>

              <a href="#" id="com" onClick={() => handleFilterChange('completed')}>Completed</a>
            </div>
          </div>

          <div className="completed-task">
            <p>
              Completed: <span id="c-count">{tasks.filter((task) => task.completed).length}</span>
            </p>
          </div>
          <div className="remaining-task">
            <p>
              <span id="total-tasks">
                Total Tasks: <span id="tasks-counter">{tasks.length}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
