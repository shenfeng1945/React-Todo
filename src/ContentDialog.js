import React, {Component} from 'react'
import $ from 'jquery';
import CreateDialog from './CreateDialog'
import {TodoModel} from "./leancloud"

export default class ContentDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            curSelectTodoFolder: {},
            isActiveAddFolderDialog: false,
            newFolder: ''
        }
    }

    render() {
        return (
            <CreateDialog onSubmit={this.addFolder.bind(this)}
                          onCancel={this.cancelAddFolder.bind(this)}
                          newFolder={this.state.newFolder}
                          onChange={this.changeFolderTitle.bind(this)}/>
        )
    }
    changeFolderTitle(e){
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.newFolder = e.target.value
        this.setState(stateCopy)
    }
    addFolder(e){
        let userId=this.props.userId
        let title = this.state.newFolder
        TodoModel.createFolder(userId,title,(id)=>{
            let folder = {
                usrId:id,
                folderName:title
            }
            this.props.onAddFolder(folder)
        })

        this.cancelAddFolder()
    }
    cancelAddFolder(){
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.newFolder = ''
        this.setState(stateCopy)
        $('.createFolder-Wrapper').removeClass('active')
    }
}