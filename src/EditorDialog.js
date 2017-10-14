import React, {Component} from 'react';
import $ from 'jquery';
import './EditorDialog.css'

export default class EditorDialog extends Component {
    constructor(props) {
        super(props)
    }

    keySubmit(e) {
        if (e.key === 'Enter') {
            this.props.onSubmit(e)
        }
    }
    onSubmit(e) {
            this.props.onSubmit(e)
    }
    render() {
        return (
            <div className="editorFolder-Wrapper">
                <div className="editorFolder">
                    <h3>修改清单名称</h3>
                    <input type="text"  value={this.props.todoInfoFolderName}
                           onChange={this.props.onChange} onKeyPress={this.keySubmit.bind(this)}/>
                    <div className="editorActions">
                        <svg className="icon" onClick={this.props.deleteFolder}><use xlinkHref="#icon-delete8e"></use></svg>
                        <button onClick={this.props.onCancel}>取消</button>
                        <button onClick={this.onSubmit.bind(this)}>确定</button>
                    </div>
                </div>
            </div>

        )
    }
}