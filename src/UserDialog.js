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
            },
            selected:'signUp'
        }
    }
    // componentWillMount(){
    //     let condition = window.localStorage.getItem('condition')
    //     let stateCopy = copyByJSON(this.state)
    //     stateCopy.selected = condition
    //     this.setState(stateCopy)
    // }
    render() {
        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    <div className="logo">Days Todo</div>
                    {this.state.selectedTab === 'signInOrSignUp' ?
                        <SignInOrSignUpForm formData={this.state.formData} selected={this.state.selected}
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
        let type='注册'
        let {email, username, password} = this.state.formData
        //username验证
        if(username.length<3 && username.length>0){
            alert('用户名过短，请更换用户名')
            return
        }else if(username.length===0){
            alert('用户名不能为空')
            return
        }
        //password验证
        if(password.length<6 && password.length>0){
            alert('密码过短，请更换密码')
            return
        }else if(password.length===0){
            alert('密码不能为空')
            return
        }
        //email验证
        if(email.search(/(.+)@(.+)\.(.+)/) < 0){
            alert('邮箱格式错误，请重新输入')
            return
        }
        let success = (user) => {
            this.props.onSignUp.call(null, user,type)
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
        let type='登录'
        let {username, password} = this.state.formData
        if(username.length===0){
            alert('用户名不能为空')
            return
        }
        if(password.length===0){
            alert('密码不能为空')
            return
        }
        let success = (user) => {
            this.props.onSignIn.call(null, user,type)
        }
        let error = (error) => {
            console.log(error)
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
        let stateCopy = copyByJSON(this.state)
        stateCopy.selectedTab = 'signInOrSignUp'
        stateCopy.selected = 'signIn'
        this.setState(stateCopy)
        // this.setState({
        //     selectedTab:'signInOrSignUp'
        // })
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