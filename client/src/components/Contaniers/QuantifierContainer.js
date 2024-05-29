import React from 'react';
import PropTypes from 'prop-types';

// Import styles
import './quantifiercontainer.css';

const QuantifierContainer = ({ text, children }) => (
    <div className="quantifier_container">
      {text || children}
    </div>
  );
  
  QuantifierContainer.propTypes = {
    text: PropTypes.string,
    children: PropTypes.node,
  };
  
  QuantifierContainer.defaultProps = {
    text: null,
    children: null,
  };
  
  export default QuantifierContainer;