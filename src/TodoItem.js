import React,{Component} from 'react'
import './TodoItem.css'
import moment from 'moment'
export default class TodoItem extends Component {
    render(){
        return <div className="todoItem">
            <input type="checkbox" checked={this.props.todo.status==='completed'}
                   onChange={this.toggle.bind(this)}/>
            <span className="title" id={this.props.todo.status}>{this.props.todo.title}</span>
            <span className="time" title={this.props.todo.status==='completed'?'完成时间':'创建时间'}>{this.props.todo.status===''?moment(this.props.todo.createTime).format('YYYY/MM/DD HH:mm')
                :moment(this.props.todo.updateTime).format('YYYY/MM/DD HH:mm')}</span>
            <svg className="icon icon-left" onClick={this.delete.bind(this)}><use xlinkHref="#icon-delete8e"></use></svg>
        </div>
    }
    delete(e){
        this.props.onDelete(e,this.props.todo)
    }
    toggle(e){
        this.props.onChange(e,this.props.todo)
    }
}