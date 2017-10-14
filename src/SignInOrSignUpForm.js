import React, {Component} from 'react'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import './SignInOrSignUpForm.css'

export default class SignInOrSignUpForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: 'signIn',
        }
    }
    render() {
        return (
            <div className="signInOrSignUp">
                <nav>
                    <label className={this.state.selected==='signIn'?'active':''}>
                        <input type="radio" value="signIn" checked={this.state.selected === 'signIn'}
                               onChange={this.switch.bind(this)}/>登录
                    </label>
                    <label className={this.state.selected==='signUp'?'active':''}>
                        <input type="radio" value="signUp" checked={this.state.selected === 'signUp'}
                               onChange={this.switch.bind(this)}/>注册
                    </label>
                </nav>
                <div className="panes">
                    {this.state.selected === 'signUp' ?
                        <SignUpForm formData={this.props.formData} onSubmit={this.props.onSignUp}
                                    onChange={this.props.onChange}/> :null
                    }
                    {this.state.selected === 'signIn'?
                        <SignInForm formData={this.props.formData}
                        onSubmit={this.props.onSignIn}
                        onForgotPassword={this.props.onForgotPassword}
                        onChange={this.props.onChange}/>:null
                    }
                </div>
            </div>
        )
    }
    switch(e){
      this.setState({
          selected:e.target.value
      })
        let condition = e.target.value
        window.localStorage.setItem('condition',condition)
    }
}
