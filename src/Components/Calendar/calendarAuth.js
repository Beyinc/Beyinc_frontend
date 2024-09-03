import React, { useEffect } from "react";
import { CalendarServices } from "../../Services/CalendarServices"; // Adjust the import based on your project structure

const OAuthPopupHandler = () => {
  useEffect(() => {
    const handleOAuthResponse = async () => {
      try {
        // Extract the authorization code from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');

        if (authCode) {
          // Use the authorization code to complete the authentication process
          await CalendarServices.processAuthCode(authCode);

          // Notify the parent window that authorization is successful
          if (window.opener) {
            window.opener.postMessage('Authorization successful', 'http://localhost:3000'); // Replace with your parent window's origin
          }

          // Close the popup window
          window.close();
        } else {
          console.error('Authorization code not found in the URL');
        }
      } catch (error) {
        console.error('Error processing the OAuth response:', error.message);
      }
    };

    handleOAuthResponse();
  }, []);

  return <div>Authorizing...</div>; // You can show a loading state or similar UI here
};

export default OAuthPopupHandler;
