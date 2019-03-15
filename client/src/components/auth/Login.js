import React, {Component} from 'react';
import {loginUser} from '../../store/actions/authAction';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
// import classnames from 'classnames';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
    state = {
        email: '',
        password: '',
        errors: {},
    };

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }

        if (nextProps.errors) {
            this.setState({errors: nextProps.errors});
        }
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };
    onSubmit = e => {
        e.preventDefault();
        const {email, password} = this.state;
        const User = {email, password};
        this.props.loginUser(User);
    };
    render() {
        const {errors} = this.state;
        return (
            <div className='login'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-8 m-auto'>
                            <h1 className='display-4 text-center'>Log In</h1>
                            <p className='lead text-center'>
                                Sign in to your DevCon account
                            </p>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    placeholder='Email Address'
                                    name='email'
                                    type='email'
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    error={errors.email}
                                />
                                <TextFieldGroup
                                    placeholder='Password'
                                    name='password'
                                    type='password'
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    error={errors.password}
                                />
                                <input
                                    type='submit'
                                    className='btn btn-info btn-block mt-4'
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        errors: state.errors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginUser: user => dispatch(loginUser(user)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Login));
