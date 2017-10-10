import React,{Component} from 'react'
export default class ForgotPassword extends Component {
    render(){
        return (
            <div className="forgotPassword">
                <h3>重置密码</h3>
                <form className="forgot" onSubmit={this.props.onSubmit}>
                    <div className="row">
                        <input type="text" placeholder="邮箱" value={this.props.formData.email}
                          onChange={this.props.onChange.bind(null,'email')}/>
                    </div>
                    <div className="actions">
                        <button type="submit">发送重置邮件</button>
                        <a href="#" onClick={this.props.onSignIn}>返回</a>
                    </div>
                </form>

            </div>
        )
    }
}