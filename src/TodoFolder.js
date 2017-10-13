import React , {Component} from 'react'
import $ from 'jquery'
import './TodoFolder.css'
export default class TodoFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // this.folderIcon = (() => {
        //     switch (this.props.todoFolderInfo.folderName) {
        //         case '我的一天': return 'todo-folder-icon-day';
        //         case '已加标记': return 'todo-folder-icon-flag';
        //         default: return 'todo-folder-icon-default';
        //     }
        // })();
        //
        // this.folderModifyIcon = (() => {
        //     switch (this.props.todoFolderInfo.folderName) {
        //         case '我的一天':
        //         case '已加标记':
        //         default: return 'todo-folder-icon todo-folder-icon-modify';
        //     }
        // })();
    }
    render() {
        return (
            <div className="todoFolderItem" onClick={this.onClick.bind(this)}>
                <svg className="icon"><use xlinkHref="#icon-home"></use></svg>
                <span className="todoFolderName">{this.props.todoFolderInfo.folderName}</span>
                {/*<span className="todoSum">{this.props.todoFolderInfo.todos.length}</span>*/}
            </div>
        )

    }
    onClick(e){
        // let folders = $('.todoFolderItem')
        // folders.removeClass('active')
        this.props.onClickFolder(this.props.index)
    }
}