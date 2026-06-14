/**
 * Tag 树生成器
 * 确保使用 '/' 分隔的层级标签能在 /tags/:path 路由下正确访问
 */
hexo.extend.generator.register('tag-tree-page', function(locals) {
  var tags = locals.tags;
  if (!tags || !tags.length) return [];

  var pages = [];

  tags.each(function(tag) {
    pages.push({
      path: tag.path,
      layout: 'tag',
      data: {
        tag: tag.name,
        posts: tag.posts
      }
    });
  });

  return pages;
});
