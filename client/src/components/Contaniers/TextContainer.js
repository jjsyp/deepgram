import React from 'react';
import PropTypes from 'prop-types';

// Import styles
import './textcontainer.css';

const TextContainer = ({ text }) => (
    <div className="text_container">
        {text}
    </div>
);

TextContainer.propTypes = {
    text: PropTypes.string,
};

TextContainer.defaultProps = {
    text: '',
};

export default TextContainer;