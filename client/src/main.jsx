    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App.jsx';
    import './index.css'; // Keep this one

    // import './App.css'; // <--- Delete or comment out this line!

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    