import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiServices } from '../../Services/ApiServices';
import { setToast } from '../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../Toast/ToastColors';

const AddReviewStars = ({ filledStars, setFilledStars }) => {




    const renderStars = () => {
        const totalStars = 5;
        const stars = [];

        for (let i = 1; i <= totalStars; i++) {
            let starClass = 'empty';

            if (i <= filledStars) {
                starClass = 'filled';
            } else if (i - 0.5 === filledStars) {
                starClass = 'half-filled';
            }

            stars.push(<span key={i} className={`star ${starClass}`} style={{ cursor: 'pointer' }} onClick={() => setFilledStars(i)}>&#9733;</span>);
        }

        return stars;
    };

    return (
        <div className="star-rating" title='Send review'>
            {/* <div>Average Review: </div> */}
            <div>
                {renderStars()}
            </div>

        </div>
    );
};

export default AddReviewStars;
