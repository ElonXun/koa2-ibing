const router = require('koa-router')()

const Evernote = require('evernote');
const config = require('../config.json');

const getRequestTokenPromise = (callback) => {
  return new Promise(function(resolve, reject){
    const client = new Evernote.Client({
      consumerKey: config.API_CONSUMER_KEY,
      consumerSecret: config.API_CONSUMER_SECRET,
      sandbox: config.SANDBOX,
      china: config.CHINA
    });
    client.getRequestToken(callback, function (error, oauthToken, oauthTokenSecret, results) {
      if (error) {
        reject(JSON.stringify(error));
      } else {
        // store the tokens in the session
        // req.session.oauthToken = oauthToken;
        // req.session.oauthTokenSecret = oauthTokenSecret;
        const redirectUrl = client.getAuthorizeUrl(oauthToken);
        console.log(oauthToken, oauthTokenSecret, results, redirectUrl);
        // redirect the user to authorize the token
        const result = {
          oauthToken,
          oauthTokenSecret,
          redirectUrl,
          results,
        };
        resolve(result);
      }
    });
  })
}

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
  // return;
  console.log(ctx.query)
  const callback = ctx.query.callbackurl;
  const res = await getRequestTokenPromise(callback)
  console.log(res)
  // ctx.redirect('https://www.baidu.com')
  ctx.body = {
    redirectUrl: res.redirectUrl
  }
})

module.exports = router
