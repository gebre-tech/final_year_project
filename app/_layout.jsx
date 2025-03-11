//_layout.jsx is the main file that will be rendered by the app. It will contain the AuthProvider and the Authenticated component. The AuthProvider will wrap the Authenticated component, which will be the main component that will be rendered by the app. The AuthProvider will provide the user with the authentication context, which will be used by the Authenticated component to determine if the user is authenticated or not. If the user is authenticated, the Authenticated component will render the Chat component, which will contain the chat interface. If the user is not authenticated, the Authenticated component will render the Login component, which will contain the login form.
import React from 'react';
import { AuthProvider } from '../context/AuthContext'; // Import AuthProvider
import Auhthenticated from './authenticated'; // Create a separate file for cleaner structure


const Layout = () => {
  
          return (
            <AuthProvider> 

                <Auhthenticated />
            
            </AuthProvider>
          );
        };

export default Layout;
