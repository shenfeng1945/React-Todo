import React, {Component} from 'react'
import '../modules/css/ForgotPassword.css'

export default class ForgotPassword extends Component {
    render() {
        return (
            <div className="forgotPassword">
                <h3>找回密码</h3>
                <form className="forgot" onSubmit={this.props.onSubmit}>
                    <input type="text" placeholder="邮箱" value={this.props.formData.email}
                           onChange={this.props.onChange.bind(null, 'email')}/>
                    <button type="submit">重置密码</button>
                    <a href="#" onClick={this.props.onSignIn}>返回登录</a>
                </form>

            </div>
        )
    }
}