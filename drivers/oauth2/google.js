export default {
    url: 'https://accounts.google.com/o/oauth2/auth',
    
    params: {
        client_id: '',
        redirect_uri: 'login/google',
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read',
        state: {},
    }
}