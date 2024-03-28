import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Redirect from './oauth/Redirect';
import TtsTool from './pages/TtsTool';    

/**
 * App component - the main component of the application which sets up the Router 
 * and different routes for the application.
 * @returns {React.Element} The rendered React element for the main routing component.
 */
const App = () => (
  <Router>
    <div>
      {/* Set up the various routes for the application */}
      <Routes>
        {/* The HomePage component is shown when the path is "/" */}
        <Route path="/" element={<HomePage />} />

        {/* The Redirect component is shown when the path is "/signin-google" */}
        <Route path="/signin-google" element={<Redirect />} />

        {/* The TtsTool component is shown when the path is "/ttstool" */}
        <Route path="/ttstool" element={<TtsTool />} />
      </Routes>
    </div>
  </Router>
);


export default App;