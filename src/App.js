import React, { Component } from 'react';
import './App.css'
import './reset.css'
import UserDialog from './UserDialog'
import 'normalize.css'
import {getCurrentUser,signOut,TodoModel} from "./leancloud"
import {copyByJSON} from './copyByJSON'
class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            user:getCurrentUser()|| {},
            newTodo:'',
            todoList:[]
        }
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
        let todos = this.state.todoList.map((item,index)=>{
            return <li>
                <TodoItem/>
            </li>
        })
      return (
          <div className="App">
              <h1>{this.state.user.username ||'我'}的代办
                  {this.state.user.id?<button onClick={this.signOut.bind(this)}>登出</button>:null}
              </h1>
              <div className="inputWrapper">
                 <TodoInput/>
              </div>
              <input type="text"/>
              <ol>{todos}</ol>
              {this.state.user.id?null:
              <UserDialog onSignUp={this.signInOrSignUp.bind(this)} onSignIn={this.signInOrSignUp.bind(this)}/>
              }
          </div>
      )
  }
  signOut(){
      signOut()
      let stateCopy = copyByJSON(this.state)
      stateCopy.user = {}
      this.setState(stateCopy)
  }
  signInOrSignUp(user){
      let stateCopy = copyByJSON(this.state)
      stateCopy.user = user
      this.setState(stateCopy)
  }
}

export default App;
