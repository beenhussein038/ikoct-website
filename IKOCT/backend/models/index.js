// One CRUD model per simple content table. Each of these gets a matching
// route file under /routes that exposes it as a REST resource.
const createCrudModel = require('./crudModel');

module.exports = {
  Event: createCrudModel('events', { orderBy: 'display_order ASC, start_date ASC' }),
  News: createCrudModel('news', { orderBy: 'published_at DESC, id DESC' }),
  BlogPost: createCrudModel('blog_posts', { orderBy: 'published_at DESC, id DESC' }),
  Story: createCrudModel('stories', { orderBy: 'id DESC' }),
  Program: createCrudModel('programs', { orderBy: 'display_order ASC' }),
  Project: createCrudModel('projects', { orderBy: 'display_order ASC' }),
  GalleryImage: createCrudModel('gallery_images', { orderBy: 'display_order ASC' }),
};
