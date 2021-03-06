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
import TodoFolder from './TodoFolder'
import Weather from './Weather'
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
            currentFolderIndex: 0,
            currentFolderName: '我的一天',
            weather: {
                currTime: '',
                week: '',
                currWeather: '',
                city: ''
            }
        }
    }

    componentWillMount() {
        //刷性页面会加载
        this.initFolderAndTodo()
        this.getWeather()
    }

    render() {
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
        let todoFolders = this.state.todoInfo.map((item, index) => {
            return (
                <TodoFolder key={index} index={index} todoFolderInfo={item}
                            onClickFolder={this.onClickLoadTodo.bind(this)}/>
            )
        })
        return (
            <div className="App">
                <nav className="aside">
                    <Weather weather={this.state.weather}/>
                    <div className="user">
                        <span className="user-head">
                            <svg className="icon icon-left">
                                <use xlinkHref="#icon-user"></use>
                            </svg>
                        </span>
                        <span className="username">
                            {this.state.user.username}
                        </span>
                        <span className="logout" title='登出'>
                            <svg className="icon icon-left" onClick={this.signOut.bind(this)}>
                                <use xlinkHref="#icon-off"></use>
                            </svg>
                        </span>
                    </div>
                    <div className="todoFolderItemWrap">
                        {todoFolders}
                    </div>
                    <div className="createFolderAction" onClick={this.createFolder.bind(this)}>
                        <svg className="icon icon-left icon-small">
                            <use xlinkHref="#icon-add"></use>
                        </svg>
                        <span>新建分组</span>
                    </div>
                </nav>
                <section className="content">
                    <div className="todo-head">{this.state.currentFolderName}——代办事项</div>
                    <div className="inputWrapper">
                        <TodoInput content={this.state.newTodo} onSubmit={this.addTodo.bind(this)}
                                   onChange={this.changeTitle.bind(this)}/>
                        <svg className="icon icon-left">
                            <use xlinkHref="#icon-enter"></use>
                        </svg>
                    </div>
                    <div className="todoItem-Info">
                        <ol className="todoItems active">{todosAll}</ol>
                        <ol className="todoItems ">{todosActive}</ol>
                        <ol className="todoItems">{todosFinish}</ol>
                    </div>
                    <div className="todoItemState">
                        <a href="#" className="state active" onClick={this.conditionChange.bind(this)}>
                            Everything 所有
                        </a>
                        <a href="#" className="state" onClick={this.conditionChange.bind(this)}>
                            Processing 待完成
                        </a>
                        <a href="#" className="state" onClick={this.conditionChange.bind(this)}>
                            Completed 已完成
                        </a>
                    </div>
                </section>

                {this.state.user.id ? null :
                    <UserDialog onSignUp={this.signInOrSignUp.bind(this)} onSignIn={this.signInOrSignUp.bind(this)}/>
                }
                <ContentDialog onAddFolder={this.onAddFolder.bind(this)} userId={this.state.user.id}
                               onEditorFolder={this.enterEditorFolder.bind(this)}
                               todoInfoFolderName={this.state.currentFolderName}
                               editorFolderName={this.editorFolderName.bind(this)}
                               deleteFolder={this.deleteFolder.bind(this)}
                               todoInfoLength={this.state.todoInfo.length}/>
            </div>
        )
    }

    deleteFolder(e) {
        let folderId = this.state.todoInfo[this.state.currentFolderIndex].folderId
        let success = () => {
            let stateCopy = copyByJSON(this.state)
            stateCopy.todoInfo.splice(stateCopy.currentFolderIndex, 1)
            stateCopy.todoList = []
            this.setState(stateCopy)
            this.initFolderAndTodo()
            //当我删除某一个todoFolder后,自动点击第一个跳到最前面
             $('.todoFolderItem').eq(0).click()
        }
        TodoModel.destroyFolder(folderId, success)
    }

    //更改清单内容
    editorFolderName(e) {
        let stateCopy = copyByJSON(this.state)
        stateCopy.currentFolderName = e.target.value
        this.setState(stateCopy)
    }

    //确定更改
    enterEditorFolder(e) {
        let folderName = this.state.currentFolderName
        let folderId = this.state.todoInfo[this.state.currentFolderIndex].folderId
        let success = () => {
            this.initFolderAndTodo()
        }
        TodoModel.editorFolderName(folderId, folderName, success)
    }

    conditionChange(e) {
        let $a = $(e.currentTarget)
        let index = $a.index()
        $('a.state').eq(index).addClass('active').siblings('a.state').removeClass('active')
        $('ol.todoItems').eq(index).addClass('active').siblings('ol.todoItems').removeClass('active')

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
        stateCopy.currentFolderName = stateCopy.todoInfo[index].folderName
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
        stateCopy.currentFolderName = '我的一天'
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
            let stateCopy = copyByJSON(this.state)
            stateCopy.todoInfo[stateCopy.currentFolderIndex].todos.unshift(todo)
            stateCopy.todoList.push(todo)
            stateCopy.newTodo = ''
            this.setState(stateCopy)
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

    getCurrentTime() {
        return new Date().toLocaleString()
    }

    getWeek() {
        let week = new Date().getDay()
        switch (week) {
            case 0:
                return '星期日'
            case 1:
                return '星期一'
            case 2:
                return '星期二'
            case 3:
                return '星期三'
            case 4:
                return '星期四'
            case 5:
                return '星期五'
            case 6:
                return '星期六'
        }
    }

    getWeatherSuccess(data) {
        if (data.status === 'OK') {
            let stateCopy = copyByJSON(this.state)
            stateCopy.weather.currTime = this.getCurrentTime()
            stateCopy.weather.city = data.weather[0]['city_name']
            stateCopy.weather.currWeather = data.weather[0].now.text
            stateCopy.weather.week = this.getWeek()
            this.setState(stateCopy)
            setInterval(() => {
                let stateCopy = copyByJSON(this.state)
                stateCopy.weather.currTime = this.getCurrentTime()
                this.setState(stateCopy)
            }, 1000)
        }else{
            alert('获取城市,天气失败')
            let stateCopy = copyByJSON(this.state)
            stateCopy.weather.currTime = this.getCurrentTime()
            stateCopy.weather.week = this.getWeek()
            this.setState(stateCopy)
            setInterval(() => {
                let stateCopy = copyByJSON(this.state)
                stateCopy.weather.currTime = this.getCurrentTime()
                this.setState(stateCopy)
            }, 1000)
        }
    }

    getWeather() {
        var request = new XMLHttpRequest()
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 400) {
                    this.getWeatherSuccess(JSON.parse(request.responseText))
                } else {
                    console.log('get weather fail')
                }
            }
        }
        request.open('get', 'https://weixin.jirengu.com/weather')
        request.send()
    }
}

export default App;
