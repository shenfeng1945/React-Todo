import React, {Component} from 'react'
import SignInOrSignUpForm from './SignInOrSignUpForm'
import ForgotPassword from './ForgotPassword'
import './UserDialog.css'
import {sendPassword,signUp,signIn} from './leancloud'
import {copyByJSON} from "./copyByJSON";
export default class UserDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 'signInOrSignUp',
            formData:{
                username:'',
                email:'',
                password:''
            }
        }
    }
    render() {
        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    {this.state.selectedTab === 'signInOrSignUp' ?
                        <SignInOrSignUpForm formData={this.state.formData}
                        onSignUp={this.signUp.bind(this)}
                        onSignIn={this.signIn.bind(this)}
                        onForgotPassword={this.showForgotPassword.bind(this)}
                        onChange={this.changeFormData.bind(this)}/>
                        :
                        <ForgotPassword formData={this.state.formData.email}
                                        onSignIn={this.returnSignIn.bind(this)}
                                        onSubmit={this.resetPassword.bind(this)}
                                        onChange={this.changeFormData.bind(this)}
                        />
                    }

                </div>
            </div>
        )
    }
    signUp(e){
        e.preventDefault()
        let {email, username, password} = this.state.formData
        let success = (user) => {
            this.props.onSignUp.call(null, user)
        }
        let error = (error) => {
            switch (error.code) {
                case 202:
                    alert('用户名已被占用')
                    break
                default:
                    alert(error)
                    break
            }
        }
        signUp(email, username, password, success, error)
    }
    signIn(e){
        e.preventDefault()
        let {username, password} = this.state.formData
        let success = (user) => {
            this.props.onSignIn.call(null, user)
        }
        let error = (error) => {
            switch (error.code) {
                case 210:
                    alert('用户名和密码不匹配')
                    break
                case 211:
                    alert('找不到该用户')
                    break
                default:
                    alert(error)
                    break
            }
        }
        signIn(username, password, success, error)
    }
    showForgotPassword(){
        this.setState({
            selectedTab:'forgotPassword'
        })
    }
    returnSignIn(){
        this.setState({
            selectedTab:'signInOrSignUp'
        })
    }
    resetPassword(e){
        e.preventDefault()
        let success = (success)=>{
            alert('已发送重置密码邮件到邮箱，请去邮箱检查并重置密码')
            // let stateCopy = copyByJSON(this.state)
            // stateCopy.selectedTab = 'signIn'
            // this.setState(stateCopy)
        }
        let error = (error)=>{
            switch(error.code){
                case 1:
                    alert('请不要往同一个邮件地址发送太多邮件')
                    break;
                case 205:
                    alert('找不到使用此邮箱注册的用户')
                    break;
            }
        }
        sendPassword(this.state.formData.email,success,error)
    }
    changeFormData(key,e){
        let stateCopy = copyByJSON(this.state)
        stateCopy.formData[key] = e.target.value
        this.setState(stateCopy)
    }
}