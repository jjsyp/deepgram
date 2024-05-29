import React from 'react';
import PropTypes from 'prop-types';

// Import styles
import './quantifiercontainer.css';

const QuantifierContainer = ({ text, children }) => (
    <div className="quantifier_container">
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
  
  export default QuantifierContainer;