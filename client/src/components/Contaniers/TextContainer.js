import React from 'react';
import PropTypes from 'prop-types';

// Import styles
import './textcontainer.css';

const TextContainer = ({ text, children }) => (
    <div className="text_container">
      {text || children}
    </div>
  );
  
  TextContainer.propTypes = {
    text: PropTypes.string,
    children: PropTypes.node,
  };
  
  TextContainer.defaultProps = {
    text: null,
    children: null,
  };
  
  export default TextContainer;