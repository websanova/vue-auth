export default {
    url: 'https://accounts.google.com/o/oauth2/auth',
    
    params: {
        client_id: '',
        redirect_uri: 'login/google',
        response_type: 'code',
        scope: 'email',
        state: {},
    }
}