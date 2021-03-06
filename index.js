'use strict';

const Koa = require('koa');
const views = require('koa-views');
const serve = require('koa-static');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { join } = require('path');

(async () => {
    try {
        // 配置与初始化
        global.config = require('./init/config').init();
        await require('./init/mongoose').init();

        const app = new Koa();
        const router = new Router();

        // 设置模板引擎
        app.use(views(join(__dirname, '/views'), {
            extension: 'hbs',
            map: { hbs: 'handlebars' },
            options: {
                partials: { layout: 'layout' }
            }
        }));

        // 静态资源
        app.use(serve(join(__dirname, '/public')));

        // Body parser
        app.use(bodyParser());

        // 设置路由
        const index = require('./routes/index');
        const users = require('./routes/users');
        const member = require('./routes/member');
        router.use('/', index.routes(), index.allowedMethods());
        router.use('/users', users.routes(), users.allowedMethods());
        router.use('/member',member.routes(), member.allowedMethods());
        app.use(router.routes());

        app.listen(global.config.system.port, global.config.system.host);
    } catch (err) {
        console.error(err.stack);
    }
})();
