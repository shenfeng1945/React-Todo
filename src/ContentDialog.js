import React, {Component} from 'react'
import $ from 'jquery';
import CreateDialog from './CreateDialog'
import {TodoModel} from "./leancloud"
import EditorDialog from './EditorDialog'
import {copyByJSON} from './copyByJSON'

export default class ContentDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            curSelectTodoFolder: {},
            isActiveAddFolderDialog: false,
            newFolder: '',
        }

    }
    render() {
        return (
            <div>
                <CreateDialog onSubmit={this.addFolder.bind(this)}
                              onCancel={this.cancelAddFolder.bind(this)}
                              newFolder={this.state.newFolder}
                              onChange={this.changeFolderTitle.bind(this)}/>

                <EditorDialog onCancel={this.cancelEditorFolder.bind(this)}
                              onSubmit={this.onEditorFolder.bind(this)}
                              todoInfoFolderName={this.props.todoInfoFolderName}
                              onChange={this.props.editorFolderName}
                              deleteFolder={this.deleteFolder.bind(this)}/>
            </div>
        )
    }
    deleteFolder(e){
        this.props.deleteFolder(e)
        this.cancelEditorFolder()
    }
    onEditorFolder(e){
        this.props.onEditorFolder(e)
        this.cancelEditorFolder()
    }
    cancelEditorFolder(){
        $('.editorFolder-Wrapper').removeClass('active')
    }
    changeFolderTitle(e) {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.newFolder = e.target.value
        this.setState(stateCopy)
    }

    addFolder(e) {
        let userId = this.props.userId
        let title = this.state.newFolder
        TodoModel.createFolder(userId, title, (id) => {
            let folder = {
                usrId: id,
                folderName: title
            }
            this.props.onAddFolder(folder)
        })

        this.cancelAddFolder()
    }

    cancelAddFolder() {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.newFolder = ''
        this.setState(stateCopy)
        $('.createFolder-Wrapper').removeClass('active')
    }
}