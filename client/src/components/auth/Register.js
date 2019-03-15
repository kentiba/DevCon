import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {registerUser} from '../../store/actions/authAction';
import TextFieldGroup from '../common/TextFieldGroup';

class Register extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        password2: '',
        errors: {},
    };

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }

    componentWillReceiveProps(nextProps) {
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
        const {name, email, password, password2} = this.state;
        const newUser = {name, email, password, password2};
        const {history} = this.props;
        this.props.registerUser(newUser, history);
    };
    render() {
        const {errors} = this.state;
        return (
            <div className='register'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-8 m-auto'>
                            <h1 className='display-4 text-center'>Sign Up</h1>
                            <p className='lead text-center'>
                                Create your DevCon account
                            </p>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    placeholder='Name'
                                    name='name'
                                    type='text'
                                    value={this.state.name}
                                    onChange={this.onChange}
                                    error={errors.name}
                                />

                                <TextFieldGroup
                                    placeholder='Email Address'
                                    name='email'
                                    type='email'
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    error={errors.email}
                                    info='This site uses Gravatar, so if you want a profile image , use a Gravatar email'
                                />

                                <TextFieldGroup
                                    placeholder='Password'
                                    name='password'
                                    type='password'
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    error={errors.password}
                                />
                                <TextFieldGroup
                                    placeholder='Confirm Password'
                                    name='password2'
                                    type='password'
                                    value={this.state.password2}
                                    onChange={this.onChange}
                                    error={errors.password2}
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
        registerUser: (user, history) => dispatch(registerUser(user, history)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Register));
