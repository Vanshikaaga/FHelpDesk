import axios from './axios.config';

const FB_APP_ID = process.env.REACT_APP_FB_APP_ID || '1234567890';

class FacebookService {
  // Initialize Facebook SDK
  initFacebookSDK = () => {
    return new Promise((resolve, reject) => {
      if (window.FB) {
        console.log('Facebook SDK already loaded');
        resolve(window.FB);
        return;
      }
          if (document.getElementById('facebook-jssdk')) {
      const interval = setInterval(() => {
        if (window.FB) {
          clearInterval(interval);
          resolve(window.FB);
        }
      }, 100);
      return;
    }

    // Load SDK script
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      resolve(window.FB);
    };

      const script = document.createElement('script');
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.id = 'facebook-jssdk';

      script.onerror = () => {
        reject(new Error('Failed to load Facebook SDK script'));
      };

      window.fbAsyncInit = () => {
        window.FB.init({
          appId: FB_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });

        console.log('Facebook SDK initialized successfully');
        resolve(window.FB);
      };

      document.body.appendChild(script);
    });
  };

  loginWithFacebook = () => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('Facebook SDK not initialized. Please refresh the page and try again.'));
        return;
      }

      window.FB.login((response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          this.exchangeToken(accessToken)
            .then(result => resolve(result))
            .catch(error => reject(error));
        } else {
          reject(new Error('Facebook login was cancelled or failed'));
        }
      }, { scope: 'pages_show_list,pages_messaging,pages_read_engagement,email' });
    });
  };

  exchangeToken = async (shortLivedToken) => {
    try {
      const response = await axios.post('/api/facebook/exchange-token', {
        accessToken: shortLivedToken
      });

      if (response.data.success) {
        return response.data.pages;
      } else {
        throw new Error(response.data.message || 'Failed to exchange token');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  connectPage = async (pageData) => {
    try {
      const response = await axios.post('/api/facebook/connect-page', pageData);

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to connect page');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  getConnectedPages = async () => {
    try {
      const response = await axios.get('/api/facebook/pages');

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch connected pages');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  disconnectPage = async (pageId) => {
    try {
      const response = await axios.delete(`/api/facebook/disconnect-page/${pageId}`);

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to disconnect page');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
}

export default new FacebookService();
