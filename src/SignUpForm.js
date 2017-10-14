import React, {Component} from 'react'
import './SignUpForm.css'

export default class SignUpForm extends Component {
    render() {
        return (
            <form className="signUpForm" onSubmit={this.props.onSubmit}>
                <input type="text" placeholder="用户名（不少于三位）" value={this.props.formData.username}
                       onChange={this.props.onChange.bind(null, 'username')}/>
                <input type="password" placeholder="密码（不少于六位）" value={this.props.formData.password}
                       onChange={this.props.onChange.bind(null, 'password')}/>
                <input type="text" placeholder="邮箱" value={this.props.formData.email}
                       onChange={this.props.onChange.bind(null, 'email')}/>
                <button type="submit">注册</button>
            </form>
        )
    }
}
