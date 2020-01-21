const Koa = require('koa');
const app = new Koa();

app.use(require('koa-logger')());

const body = require('koa-json-body');
app.use(body({ limit: '500kb', fallback: true }));

const serve = require('koa-static');
const send = require('koa-send');
app.use(serve('dist/', { defer: true }));

const Router = require('koa-router');
const router = new Router();

const { evalCode } = require('./src/eval');
router.post('/eval', async ctx => {
    ctx.body = evalCode(ctx.request.body.code);
});

router.get('/n/*', async ctx => {
    await send(ctx, 'dist/index.html');
});

app
    .use(router.routes())
    .use(router.allowedMethods());

if (!module.parent) {
    app.listen(process.env.PORT || 3000);
} else {
    module.exports = app;
}

