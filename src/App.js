import React, {Component} from 'react';
import './App.css'
import './reset.css'
import UserDialog from './UserDialog'
import 'normalize.css'
import {getCurrentUser, signOut, TodoModel, GroupModel} from "./leancloud"
import {copyByJSON} from './copyByJSON'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import ContentDialog from './ContentDialog'
import GroupItem from './GroupItem'
import TodoFolder from './TodoFolder'
import $ from 'jquery';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: getCurrentUser() || {},
            newTodo: '',
            todoList: [],
            newFolder: '',
            curFolder: '',
            todoInfo: [
                {folderName: '我的一天', userId: '', todos: [], folderId: ''}
            ],
            currentFolderIndex: 0
        }
    }
    componentWillMount() {
        //刷性页面会加载
        this.initFolderAndTodo()
    }

    render() {
        console.log('todoList',this.state.todoList)
        let todosAll = this.state.todoList.filter((item) => !item.deleted).map((item, index) => {
            return <li key={index}>
                <TodoItem todo={item} onDelete={this.delete.bind(this)} onChange={this.toggle.bind(this)}/>
            </li>
        })
        let todosActive = this.state.todoList.filter((item) => item.status === '' && !item.deleted).map((item, index) => {
            return <li key={index}>
                <TodoItem todo={item} onDelete={this.delete.bind(this)} onChange={this.toggle.bind(this)}/>
            </li>
        })
        let todosFinish = this.state.todoList.filter((item) => item.status === 'completed').map((item, index) => {
            return <li key={index}>
                <TodoItem todo={item} onDelete={this.delete.bind(this)} onChange={this.toggle.bind(this)}/>
            </li>
        })


        // let groups = this.state.groups.filter((item)=>item!=='我的一天').map((item,index)=>{
        //     return (
        //         <li key={index}>
        //             <GroupItem title={item} selected={this.state.curFolder}/>
        //         </li>
        //     )
        // })
        let todoFolders = this.state.todoInfo.map((item, index) => {
            return (
                <TodoFolder key={index} index={index} todoFolderInfo={item}
                            onClickFolder={this.onClickLoadTodo.bind(this)}/>
            )
        })
        return (
            <div className="App">
                <nav className="aside">
                    <ul className="weather">
                        <li>时间：</li>
                        <li>星期：</li>
                        <li>天气：</li>
                        <li>城市：</li>
                    </ul>
                    <div className="user">
                        <svg className="icon">
                            <use xlinkHref="#icon-user"></use>
                        </svg>
                        {this.state.user.username}
                        <svg className="icon" onClick={this.signOut.bind(this)}>
                            <use xlinkHref="#icon-off"></use>
                        </svg>
                    </div>
                    <div className="todoFolderItemWrap">
                        {todoFolders}
                    </div>
                    <div className="createFolderAction" onClick={this.createFolder.bind(this)}>
                        <svg className="icon">
                            <use xlinkHref="#icon-add"></use>
                        </svg>
                        <span>创建清单</span>
                    </div>
                </nav>
                <section className="content">
                    <div className="inputWrapper">
                        <TodoInput content={this.state.newTodo} onSubmit={this.addTodo.bind(this)}
                                   onChange={this.changeTitle.bind(this)}/>
                        <svg className="icon">
                            <use xlinkHref="#icon-enter"></use>
                        </svg>
                    </div>
                    <ol className="todoItem active">{todosAll}</ol>
                    <ol className="todoItem ">{todosActive}</ol>
                    <ol className="todoItem">{todosFinish}</ol>
                    <div className="todoItemState">
                        <a href="#" className="links active" onClick={this.conditionChange.bind(this)}>
                            Everything
                        </a>
                        <a href="#" className="links" onClick={this.conditionChange.bind(this)}>
                            Processing
                        </a>
                        <a href="#" className="links" onClick={this.conditionChange.bind(this)}>
                            Completed
                        </a>
                    </div>
                </section>

                {this.state.user.id ? null :
                    <UserDialog onSignUp={this.signInOrSignUp.bind(this)} onSignIn={this.signInOrSignUp.bind(this)}/>
                }
                {/*<CreateDialog onSubmit={this.addFolder.bind(this)}*/}
                {/*onCanccescel={this.cancelAddFolder.bind(this)}*/}
                {/*newFolder={this.state.newFolder}*/}
                {/*onChange={this.changeFolderTitle.bind(this)}/>*/}
                <ContentDialog onAddFolder={this.onAddFolder.bind(this)} userId={this.state.user.id}/>
            </div>
        )
    }

    conditionChange(e){
        let $a = $(e.currentTarget)
        let index = $a.index()
        $('a.links').eq(index).addClass('active').siblings('a.links').removeClass('active')
        $('ol.todoItem').eq(index).addClass('active').siblings('ol.todoItem').removeClass('active')

    }

    initFolderAndTodo() {
        //初始化
        let user = getCurrentUser()
        let error = (error) => {
            console.log(error)
        }
        if (user) {
            TodoModel.getFolder(user, (folders) => {
                let stateCopy = JSON.parse(JSON.stringify(this.state))
                folders.forEach((item, index) => {
                    stateCopy.todoInfo[index] = item.attributes
                    stateCopy.todoInfo[index].folderId = item.id
                })
                this.setState(stateCopy)
                //folder加载完后,再加载todo
                let folderId = this.state.todoInfo[this.state.currentFolderIndex].folderId
                TodoModel.getByUser(folderId, (todos) => {
                    let stateCopy = JSON.parse(JSON.stringify(this.state))
                    stateCopy.todoList = todos
                    this.setState(stateCopy)
                }, error)
            })
        }
    }

    onClickLoadTodo(index) {
        let stateCopy = copyByJSON(this.state)
        stateCopy.currentFolderIndex = index
        this.setState(stateCopy)

        let folderId = stateCopy.todoInfo[stateCopy.currentFolderIndex].folderId
        TodoModel.getByUser(folderId, (todos) => {
            let stateCopy = JSON.parse(JSON.stringify(this.state))
            stateCopy.todoList = todos
            this.setState(stateCopy)
        })

    }

    componentDidMount() {
    }

    onAddFolder(folder) {
        let newFolder = {
            userId: folder.userId,
            folderName: folder.folderName,
            todos: []
        }
        let stateCopy = copyByJSON(this.state)
        stateCopy.todoInfo.push(newFolder)
        stateCopy.newFolder = ''
        this.setState(stateCopy)

        //若不加,点击folder时,并没有绑定id
        TodoModel.getFolder(this.state.user, (folders) => {
            let stateCopy = JSON.parse(JSON.stringify(this.state))
            folders.forEach((item, index) => {
                stateCopy.todoInfo[index] = item.attributes
                stateCopy.todoInfo[index].folderId = item.id
            })
            this.setState(stateCopy)
        })

    }

    createFolder() {
        $('.createFolder-Wrapper').addClass('active')
    }

    signOut() {
        signOut()
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.user = {}
        stateCopy.todoList = []
        stateCopy.todoInfo = []
        this.setState(stateCopy)

    }

    signInOrSignUp(user, type) {
        if (type === '注册') {
            TodoModel.init(user, (id) => {
                // let stateCopy = copyByJSON(this.state)
                // stateCopy.todoInfo[0].userId = id
                // stateCopy.user = user
                // this.setState(stateCopy)
                this.initFolderAndTodo()
            }, (error) => {
            })
        } else if (type === '登录') {
            //登录成功会加载
            this.initFolderAndTodo()
        }
        let stateCopy = copyByJSON(this.state)
        stateCopy.user = user
        this.setState(stateCopy)
        if (user) {
            TodoModel.getByUser(user, (todos) => {
                let stateCopy = JSON.parse(JSON.stringify(this.state))
                stateCopy.todoList = todos
                this.setState(stateCopy)
            })
        }
    }

    addTodo(event) {
        let newTodo = {
            title: event.target.value,
            status: '',
            deleted: false
        }
        TodoModel.create(this.state.todoInfo[this.state.currentFolderIndex].folderId, newTodo, (todo) => {
            // newTodo.id = id
            // this.state.todoList.push(newTodo)
            // this.setState({
            //     newTodo: '',
            //     todoList: this.state.todoList
            // })
            let stateCopy = copyByJSON(this.state)
            stateCopy.todoInfo[stateCopy.currentFolderIndex].todos.unshift(todo)
            stateCopy.todoList.push(todo)
            stateCopy.newTodo = ''
            this.setState(stateCopy)
            console.log(this.state.todoInfo[0])
        }, (error) => {
            console.log(error)
        })

    }

    changeTitle(event) {
        this.setState({
            newTodo: event.target.value,
            todoList: this.state.todoList
        })
    }

    delete(event, todo) {
        TodoModel.destroy(todo.id, () => {
            todo.deleted = true
            this.setState(this.state)
            //根据id删除todoInfo当前folder里的todos里的某一个
            let stateCopy = copyByJSON(this.state)
            this.state.todoInfo[0].todos.map((item, index) => {
                if (item.id === todo.id) {
                    stateCopy.todoInfo[0].todos.splice(index, 1)
                }
            })
            this.setState(stateCopy)
        })

    }

    toggle(e, todo) {
        let oldStatus = todo.status
        todo.status = todo.status === 'completed' ? '' : 'completed'
        TodoModel.update(todo, () => {
            this.setState(this.state)
            this.initFolderAndTodo()
        }, (error) => {
            todo.status = oldStatus
            this.setState(this.state)
        })
    }
}

export default App;
