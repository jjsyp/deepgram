import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import styles from './styles.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <style src={styles}></style>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </>
);

