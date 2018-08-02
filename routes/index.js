const router = require('koa-router')()

const Evernote = require('evernote');
const config = require('../config.json');
const callbackUrl = "http://localhost:3000/json";


router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/getOauth', async (ctx, next) => {
  // ctx.redirect('https://sandbox.evernote.com/OAuth.action?oauth_token=xuyunfeng.164FB39EEA8.687474703A2F2F6C6F63616C686F73743A333030302F6F617574685F63616C6C6261636B.36D1C99184257C8D4B42E72DD983FFF3');
  // return;
  const client = new Evernote.Client({
    consumerKey: config.API_CONSUMER_KEY,
    consumerSecret: config.API_CONSUMER_SECRET,
    sandbox: config.SANDBOX,
    china: config.CHINA
  });

  client.getRequestToken(callbackUrl, function (error, oauthToken, oauthTokenSecret, results) {
    if (error) {
      console.log(JSON.stringify(error));
      ctx.redirect('/');
    } else {
      // store the tokens in the session
      // req.session.oauthToken = oauthToken;
      // req.session.oauthTokenSecret = oauthTokenSecret;
      console.log(oauthToken, oauthTokenSecret, client.getAuthorizeUrl(oauthToken))
      let url = client.getAuthorizeUrl(oauthToken);
      // redirect the user to authorize the token
      console.log('begin url', url)
      ctx.redirect(url);
    }
  });
})

module.exports = router
