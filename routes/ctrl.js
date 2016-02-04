module.exports = function (app, routes) {
    //PC端
    app.get('/',routes.home);
    app.get('/about',routes.about);
    app.get('/post',routes.post);
    app.get('/list',routes.list);
    app.post('/searchdo',routes.searchdo);

    //移动端
    app.get('/mobile/home',routes.mobilehome);
    app.get('/mobile/list',routes.mobilelist);
    app.get('/mobile/about',routes.mobileabout);
    app.get('/mobile/post',routes.mobilepost);
    app.post('/mobile/searchdo',routes.mobilesearchdo);

    //通用
    app.get('/testcode',routes.testcode);
    app.get('/upload',routes.upload);
    app.get('/uploadsuccess',routes.uploadsuccess);
    app.post('/uploaddo',routes.uploaddo);
    app.get('/wechat',routes.wechat);
    
    //后端
    app.get('/_postlist',routes._postlist);
    app.get('/publish',routes.publish);
    app.post('/publishdo',routes.publishdo);
    app.get('/login',routes.login);
    app.post('/logindo',routes.logindo);
    app.get('/test',routes.test);
    
    app.get('/trans',routes.trans);
    app.get('/pingyin',routes.pingyin);
    
    //app
    app.get('/app',routes.app_home);
    app.get('/app/post',routes.app_post);
    app.get('/app/list',routes.app_list);
    app.get('/app/about',routes.app_about);
    app.get('/app/adv',routes.app_adv);
    app.get('/loading',routes.loading);
    app.post('/app/:sql',routes.appdo);
};