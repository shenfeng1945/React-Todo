import React, {Component} from 'react';
import $ from 'jquery';
import './CreateDialog.css';

export default class CreateDialog extends Component {
    constructor(props) {
        super(props)
    }

    keySubmit(e) {
        if (e.key === 'Enter') {
            this.props.onSubmit(e)
        }
    }
    onSubmit(e) {
        if (this.props.newFolder.trim() !== '') {
            this.props.onSubmit(e)
        }
    }
    render() {
        return (
            <div className="createFolder-Wrapper">
                <div className="createFolder clearfix">
                    <h3>新建分组</h3>
                    <input type="text" placeholder="分组名称" value={this.props.newFolder}
                           onChange={this.props.onChange} onKeyPress={this.keySubmit.bind(this)}/>
                    <div className="createActions">
                        <button className="btn btn-cancel" onClick={this.props.onCancel}>取消</button>
                        <button className="btn btn-enter" onClick={this.onSubmit.bind(this)}>新建</button>
                    </div>
                </div>
            </div>

        )
    }
}