import React, { Component } from 'react';
import './App.css'
import './reset.css'
import UserDialog from './UserDialog'
import 'normalize.css'
import {getCurrentUser,signOut,TodoModel} from "./leancloud"
import {copyByJSON} from './copyByJSON'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            user:getCurrentUser()|| {},
            newTodo:'',
            todoList:[]
        }
        //初始化
        let user = getCurrentUser()
        if(user){
            TodoModel.getByUser(user,(todos)=>{
                let stateCopy = JSON.parse(JSON.stringify(this.state))
                stateCopy.todoList = todos
                this.setState(stateCopy)
            })
        }
    }
  render() {
        let todos = this.state.todoList.filter((item)=>!item.deleted).map((item,index)=>{
            return <li key={index}>
                <TodoItem todo={item} onDelete={this.delete.bind(this)} onChange={this.toggle.bind(this)}/>
            </li>
        })
      return (
          <div className="App">
              <h1>{this.state.user.username ||'我'}的代办
                  {this.state.user.id?<button onClick={this.signOut.bind(this)}>登出</button>:null}
              </h1>
              <div className="inputWrapper">
                 <TodoInput content={this.state.newTodo} onSubmit={this.addTodo.bind(this)}
                            onChange={this.changeTitle.bind(this)}/>
              </div>
              <ol>{todos}</ol>
              {this.state.user.id?null:
              <UserDialog onSignUp={this.signInOrSignUp.bind(this)} onSignIn={this.signInOrSignUp.bind(this)}/>
              }
          </div>
      )
  }
  signOut(){
      signOut()
      let stateCopy = JSON.parse(JSON.stringify(this.state))
      stateCopy.user = {}
      stateCopy.todoList = []
      this.setState(stateCopy)

  }
  signInOrSignUp(user){
      let stateCopy = copyByJSON(this.state)
      stateCopy.user = user
      this.setState(stateCopy)
      if(user){
          TodoModel.getByUser(user,(todos)=>{
              let stateCopy = JSON.parse(JSON.stringify(this.state))
              stateCopy.todoList = todos
              this.setState(stateCopy)
          })
      }
  }
  addTodo(event){
      let newTodo = {
          title: event.target.value,
          status:'',
          deleted:false
      }
      TodoModel.create(newTodo,(id)=>{
          newTodo.id = id
          this.state.todoList.push(newTodo)
          this.setState({
              newTodo:'',
              todoList: this.state.todoList
          })
      },(error)=>{
          console.log(error)
      })

  }
  changeTitle(event){
     this.setState({
         newTodo:event.target.value,
         todoList: this.state.todoList
     })
  }
  delete(event,todo){
      TodoModel.destroy(todo.id,()=>{
          todo.deleted = true
          this.setState(this.state)
      })
  }
  toggle(e,todo){
      let oldStatus = todo.status
      todo.status = todo.status==='completed'?'':'completed'
      TodoModel.update(todo,()=>{
          this.setState(this.state)
      },(error)=>{
          todo.status = oldStatus
          this.setState(this.state)
      })
  }
}

export default App;
