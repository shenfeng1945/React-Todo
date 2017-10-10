import React,{Component} from 'react'
export default class TodoItem extends Component {
    render(){
        return <div className="todoItem">
            <input type="checkbox" checked={this.props.todo.status==='completed'}
                   onChange={this.toggle.bind(this)}/>
            <span className="title">{this.props.todo.title}</span>
            <button onClick={this.delete.bind(this)}>删除</button>
        </div>
    }
    delete(e){
        this.props.onDelete(e,this.props.todo)
    }
    toggle(e){
        this.props.onChange(e,this.props.todo)
    }
}