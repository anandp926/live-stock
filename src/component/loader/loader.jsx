import React from 'react';
import './loader.css';
import CircularLoader from './circular_loader'

const FullScreenLoader = () => {
    return(
        <div className="fullscreen-loading">
            <CircularLoader/>
        </div>
    )
}

export default FullScreenLoader