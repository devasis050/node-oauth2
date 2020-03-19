
const express = require('express');
const path = require('path');
const queryString = require('querystring');
const server = express();
const axios = require('axios');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const dotenv = require('dotenv');
dotenv.config(); 

const redirectUrl = 'http://localhost:8080/oauth/redirect';
const clientSecret = process.env.clientSecret;
const clientId = process.env.clientId;
const tokenUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?';
const userDetailUrl = 'https://graph.facebook.com/me?';

const userCache = new Map();

server.use(cookieParser());

server.get("/oauth/redirect", (req, res) => {

    /*
    When permission is not granted by user, 
        req.query.code is undefined
        req.query {
            error: 'access_denied',
            error_code: '200',
            error_description: 'Permissions error',
            error_reason: 'user_denied'
        }
    when user grants permission
        req.query.code is code from service provider
    */

    if(req.query.error) {
        res.send()
    }
    const code = req.query.code;
    console.log('code', code);
    console.log('query', req.query);
    
    const queryParams = queryString.stringify({
        client_id : clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUrl
    });


    axios.get(tokenUrl + queryParams).then(accessTokenResp => {

        const accessToken = accessTokenResp.data.access_token;
        console.log('access code response:', accessToken);

        axios.get(userDetailUrl + `access_token=${accessToken}`).then(userDataResponse => {
            const user = userDataResponse.data;
            const userSession = uuid.v4();
            userCache.set(userSession, user);
            //Write cookies
            res.cookie("userSession", userSession);

            res.redirect('/');
        }).catch(ex => {
            console.log('exception while getting userDetailUrl', ex);
            res.send('User detail exception');
        })

    }).catch(ex => {
        console.log('exception while getting access token', ex);
        res.send('Login unsuccessful');
    });

})


server.get("/", (req, res) => {
   
    //get cookie
    const userSession = req.cookies.userSession;
    console.log('userSession', userSession);
    if(userSession && userCache.get(userSession)) {
        const user = userCache.get(userSession);
        console.log('user', user);
        res.send('Hello ' + user.name)
    } else {
        const htmlPath = path.join(__dirname, '/../index.html')
        res.sendFile(htmlPath);
    }
})

server.get('/logout', (req,res) => {
    const userSession = req.cookies.userSession;
    userCache.delete(userSession);
    res.redirect('/');
});

server.listen(8080, () => console.log('Server started at 8080'));

