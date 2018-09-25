import React, {Component} from 'react'
import '../modules/css/SignInForm.css'

export default class SignInForm extends Component {
    render() {
        return (
                <form className="signInForm" onSubmit={this.props.onSubmit}>
                        <input type="text" placeholder="用户名" value={this.props.formData.username}
                               onChange={this.props.onChange.bind(null,'username')}/>
                        <input type="password" placeholder="密码" value={this.props.formData.password}
                               onChange={this.props.onChange.bind(null,'password')}/>
                    <button type="submit">登录</button>
                    <a href="#" onClick={this.props.onForgotPassword}>忘记密码?</a>
                </form>
        )
    }
}
