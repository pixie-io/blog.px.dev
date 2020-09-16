const slugify = require('slugify');

exports.categoryLink = (category) => `/${slugify(category)
  .toLowerCase()}`;
