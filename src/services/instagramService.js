const axios = require('axios');

// Get authorization URL
const getAuthUrl = ({clientId, redirectUri}) => {
  return `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;
};

// Exchange code for access token
const exchangeCodeForToken = async ({code, clientId, clientSecret, redirectUri}) => {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  
  const tokenResponse = await axios.post(
    'https://api.instagram.com/oauth/access_token',
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return tokenResponse.data;
};

// Get long-lived access token
const getLongLivedToken = async ({shortLivedToken, clientSecret}) => {
  const response = await axios.get('https://graph.instagram.com/access_token', {
    params: {
      grant_type: 'ig_exchange_token',
      client_secret: clientSecret,
      access_token: shortLivedToken,
    },
  });

  return response.data;
};

// Get user profile information
const getUserProfile = async (accessToken) => {
  const response = await axios.get(
    `https://graph.instagram.com/me?fields=id,username,media_count,account_type&access_token=${accessToken}`
  );
  return response.data;
};

// Get user media
const getUserMedia = async (accessToken, limit = 10) => {
  const params = {
      fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,children{media_url}',
      limit,
      access_token: accessToken
  }
  

  const response = await axios.get(
    'https://graph.instagram.com/me/media',
   {params} 
  );
  
  return response.data;
};

module.exports = {
  getAuthUrl,
  exchangeCodeForToken,
  getLongLivedToken,
  getUserProfile,
  getUserMedia
};
