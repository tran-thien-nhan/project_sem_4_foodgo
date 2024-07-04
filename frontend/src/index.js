import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './component/State/store';
import { ClerkProvider } from '@clerk/clerk-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
const PUBLISHABLE_KEY = "pk_test_bm92ZWwtZ3J1Yndvcm0tNzMuY2xlcmsuYWNjb3VudHMuZGV2JA";
const CLERK_SECRET_KEY = "sk_test_MGdfdAXbe1hn1qc6c9qsagaPkyH4fZSqUlckTU60gU"
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);

reportWebVitals();
