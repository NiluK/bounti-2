const fs = require('fs');
const path = require('path');
const glob = require('glob');
const compareVersions = require('compare-versions');
const readingTime = require('reading-time');
const withPlugins = require('next-compose-plugins');
const withVideos = require('next-videos');
const withOptimizedImages = require('next-optimized-images');

const withTM = require('next-transpile-modules')(['@modulz/design-system']);

module.exports = withPlugins([withTM, withOptimizedImages, withVideos], {
  // Next.js config
  // Generate URL rewrites for components and utilities
  // So navigating to /tooltip rewrites to /tooltip/[latestVersion]
});
