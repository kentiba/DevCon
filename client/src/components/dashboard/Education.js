import React, {Component} from 'react';
import {connect} from 'react-redux';
import Dayjs from 'dayjs';
import {deleteEducation} from '../../store/actions/profileAction';

class Education extends Component {
    onDeleteClick(id) {
        this.props.deleteEducation(id);
    }

    render() {
        const education = this.props.education.map(edu => (
            <tr key={edu._id}>
                <td>{edu.school}</td>
                <td>{edu.degree}</td>
                <td>
                    {Dayjs(edu.from).format('YYYY/MM/DD')} -
                    {edu.to === null
                        ? ' Now'
                        : Dayjs(edu.to).format('YYYY/MM/DD')}
                </td>
                <td>
                    <button
                        onClick={this.onDeleteClick.bind(this, edu._id)}
                        className='btn btn-danger'
                    >
                        Delete
                    </button>
                </td>
            </tr>
        ));
        return (
            <div>
                <h4 className='mb-4'>Education Credentials</h4>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>School</th>
                            <th>Degree</th>
                            <th>Years</th>
                            <th />
                        </tr>
                        {education}
                    </thead>
                </table>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteEducation: () => dispatch(deleteEducation()),
    };
};

export default connect(
    null,
    mapDispatchToProps,
)(Education);
