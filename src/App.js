import React, {useEffect} from 'react';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {editTodo, getAllTodos, getSelectedTodo, getTodosFromService} from "./features/todos/todosSlice";

function App() {
  const dispatch = useDispatch()
  const todos = useSelector(store => store.todos).todos
  const allTodos = getAllTodos({todos})
  const selectedTodos = getSelectedTodo({todos}, 6)

    useEffect(() => {
        dispatch(getTodosFromService())
    }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{
            background: "whitesmoke",
            padding: 50,
            borderRadius: 10,
            marginTop: 5,
            position: 'fixed',
            left: 5,
            top: 5,
            justifyContent: 'flex-start'
        }}>
            <h3>Selected Todo</h3>
            {
                selectedTodos && <div>
                    <h4>todo found! -> <span style={{color: 'blueviolet'}}>{selectedTodos.title}</span></h4>
                    <h4>todo owner id -> <span style={{color: 'yellowgreen'}}>{selectedTodos.userId}</span></h4>
                </div>
            }
            <div><b>{allTodos?.length}</b> is the total number of todos!</div>
        </div>
        <div style={{
            display: 'flex'
        }}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, fontSize: 18, marginTop: 10}}>
                {todos.map((todo, index) => <div key={index} style={{display: "flex", justifyContent: 'space-between', alignItems: 'center', gap: 5, padding: '5px 9px', background: "#d5d5d5", width: '100%', borderRadius: 10}}>
                    <span>{todo.title}</span>
                    <span style={{
                        position: "relative",
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        background: todo.completed ? "green" : "red",
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        dispatch(editTodo({...todo, completed: !todo.completed}))
                    }}></span>
                </div>)}
            </div>
        </div>
      </header>
    </div>
  );
}

export default App;
