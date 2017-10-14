import React , {Component} from 'react'
import $ from 'jquery'
import './TodoFolder.css'
export default class TodoFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.folderIcon = (() => {
            switch (this.props.todoFolderInfo.folderName) {
                case '我的一天': return '#icon-home';
                default: return '#icon-all01';
            }
        })();

        this.folderModifyIcon = (() => {
            switch (this.props.todoFolderInfo.folderName) {
                case '我的一天': return 'icon noModify'
                default: return 'icon noModify todo-icon-modify';
            }
        })();
        this.currentFolder = (()=>{
            switch (this.props.todoFolderInfo.folderName) {
                case '我的一天':
                    return 'todoFolderItem active'
                default:
                    return 'todoFolderItem';
            }
        })()
    }
    render() {
        return (
            <div className={this.currentFolder} onClick={this.onClick.bind(this)}>
                <svg className="icon"><use xlinkHref={this.folderIcon}></use></svg>
                <span className="todoFolderName">{this.props.todoFolderInfo.folderName}</span>
                {/*<span className="todoSum">{this.props.todoFolderInfo.todos.length}</span>*/}
                <svg className={this.folderModifyIcon} onClick={this.onEditorFolder.bind(this)}><use xlinkHref="#icon-editor"></use></svg>
            </div>
        )

    }
    onEditorFolder(e){
       let a= $('.todo-icon-modify.active').closest('.todoFolderItem').index()
        console.log(a)
            $('.editorFolder-Wrapper').addClass('active')
    }
    onClick(e){
        let index = $(e.currentTarget).index()
        $('.todoFolderItem').eq(index).addClass('active').siblings('.todoFolderItem').removeClass('active')
        $('svg.noModify').removeClass('active').eq(index).addClass('active')
        this.props.onClickFolder(this.props.index)
    }
}