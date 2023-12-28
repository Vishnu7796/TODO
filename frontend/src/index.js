import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';
import PrivateRoute from './helpers/privateRoute';

const keycloakConfig = new Keycloak({
    url : process.env.REACT_APP_KEYCLOAK_URL,
    realm : process.env.REACT_APP_KEYCLOAK_REALM,
    clientId : process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ReactKeycloakProvider 
        authClient={keycloakConfig}
        initOptions={{onLoad: 'login-required', checkLoginIframe: false}}
     >
        <PrivateRoute>
          <App />
        </PrivateRoute>
      </ReactKeycloakProvider>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
