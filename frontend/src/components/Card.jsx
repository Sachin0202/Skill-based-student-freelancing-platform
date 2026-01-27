import React from 'react';
import './Card.css';

const Card = ({ children, title, className = '', ...props }) => {
    return (
        <div className={`card ${className}`} {...props}>
            {title && <h3 className="card-title">{title}</h3>}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

export default Card;
