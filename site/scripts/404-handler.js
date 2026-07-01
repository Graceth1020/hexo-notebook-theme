/**
 * 404 处理中间件
 * 让 hexo server 将不存在的路由指向 404.html（带 404 状态码）
 * 作为最后一道中间件，捕获所有未被路由和静态文件处理程序匹配的请求
 */
hexo.extend.filter.register('server_middleware', function(app) {
  var path = require('path');
  var fs = require('fs');

  app.use(function(req, res, next) {
    // 只处理 GET/HEAD 请求
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();

    // 跳过根路径（它已被其他中间件处理）
    if (req.url === '/' || req.url === '') return next();

    var publicDir = hexo.public_dir;
    var notFoundPath = path.join(publicDir, '404.html');

    try {
      var content = fs.readFileSync(notFoundPath, 'utf-8');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(content);
    } catch (_) {
      next();  // 兜底
    }
  });
});
