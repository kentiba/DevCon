import React, {Component} from 'react';
import {connect} from 'react-redux';
import Dayjs from 'dayjs';
import {deleteExperience} from '../../store/actions/profileAction';

class Experience extends Component {
    onDeleteClick(id) {
        this.props.deleteExperience(id);
    }

    render() {
        const experience = this.props.experience.map(exp => (
            <tr key={exp._id}>
                <td>{exp.company}</td>
                <td>{exp.title}</td>
                <td>
                    {Dayjs(exp.from).format('YYYY/MM/DD')} -
                    {exp.to === null
                        ? ' Now'
                        : Dayjs(exp.to).format('YYYY/MM/DD')}
                </td>
                <td>
                    <button
                        onClick={this.onDeleteClick.bind(this, exp._id)}
                        className='btn btn-danger'
                    >
                        Delete
                    </button>
                </td>
            </tr>
        ));
        return (
            <div>
                <h4 className='mb-4'>Experience Credentials</h4>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Title</th>
                            <th>Years</th>
                            <th />
                        </tr>
                        {experience}
                    </thead>
                </table>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteExperience: () => dispatch(deleteExperience()),
    };
};

export default connect(
    null,
    mapDispatchToProps,
)(Experience);
