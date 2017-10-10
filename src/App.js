import React, { Component } from 'react';
import './App.css'
import './reset.css'
// import 'normalize.css'
class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            newTodo:'test',
            todoList:[{id:1,title:'第一'},{id:2,title:'第二'}]
        }
    }
  render() {
        let todos = this.state.todoList.map((item,index)=>{
            return <li>{item.title}</li>
        })
      return (
          <div className="App">
              <h1>我的代表</h1>
              <input type="text"/>
              <ol>{todos}</ol>
          </div>
      )
  }
}

export default App;
