const { promises, existsSync, lstatSync, readFileSync, readdirSync } = require('fs');
const { lookup: _getMimeType } = require('mime-types');
const { extname, join, parse } = require('path');
const { escapeRegExp } = require('lodash');
const imageSize = require('image-size');
const { promisify } = require('util');

const { error } = require('./Logger.js');
const { Directories } = require('@powerpala/constants');
const { isString } = require('./String.js');

const { readdir, lstat, unlink, rmdir } = promises;
const _getImageSize = promisify(imageSize);

const _labels = [ 'Util', 'File' ];
const _error = (labels, ...message) => error({ labels, message });

const getCaller = path => {
  try {
    if (path) {
      const plugin = path.match(new RegExp(`${escapeRegExp(Directories.PLUGINS)}.([-\\w]+)`));
      if (plugin) {
        return {
          type: 'plugin',
          id: plugin[1]
        };
      }
      return {
        type: 'core',
        id: 'powerpala'
      };
    }

    /**
     * If no path is provided, try to determine one with a forced error stack trace.
     */
    const stackTrace = (new Error()).stack;
    const plugin = stackTrace.match(new RegExp(`${escapeRegExp(Directories.PLUGINS)}.([-\\w]+)`));
    if (plugin) {
      return {
        type: 'plugin',
        id: plugin[1]
      };
    }
    return {
      type: 'core',
      id: 'powerpala'
    };
  } catch (err) {
    _error(_labels.concat('getCaller'), err);
  }
};

exports.getCaller = getCaller;

const getMimeType = async input => {
  try {
    let type = null;
    type = _getMimeType(input);

    if (!type) {
      const response = await get(input);
      const blob = await response?.blob?.();
      if (!blob) {
        type = response?.headers?.['content-type']?.split(';')[0];
      } else {
        type = blob?.type;
      }
    }

    if (!type) {
      if (typeof input !== 'string') {
        return type;
      }
      const mimeType = input.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      if (mimeType && mimeType.length) [ , type ] = mimeType;
    }

    return type;
  } catch (err) {
    _error(_labels.concat('getMimeType'), err);
  }
};

exports.getMimeType = getMimeType;

const removeDirRecursive = async directory => {
  if (existsSync(directory)) {
    const files = await readdir(directory);
    for (const file of files) {
      const currentPath = `${directory}/${file}`;
      const stat = await lstat(currentPath);

      if (stat.isDirectory()) {
        await removeDirRecursive(currentPath);
      } else {
        await unlink(currentPath);
      }
    }
    await rmdir(directory);
  }
};

exports.removeDirRecursive = removeDirRecursive;

/**
 * Gets the dimensions of an image or video. Works for URLs (http/blob/data/protocol).
 */
const getMediaDimensions = async (url, mimeType) => {
  mimeType = mimeType || await getMimeType(url);
  // Check if it's an image
  if (mimeType?.split('/')[0] === 'image') {
    // If it's a file, we'll use the image-size package
    if (existsSync(url) && lstatSync(url).isFile()) {
      return new Promise(resolved => {
        _getImageSize(url).then(dimensions => resolved({ width: dimensions.width, height: dimensions.height }));
      });
    }
    return new Promise(resolved => {
      const img = new Image();
      img.onload = () => resolved({ width: img.naturalWidth, height: img.naturalHeight });
      img.src = url;
    });
  // Check if it's a video
  } else if (mimeType?.split('/')[0] === 'video') {
    return new Promise(resolve => {
      const video = document.createElement('video');
      video.src = url;
      video.addEventListener('loadedmetadata', () =>
        resolve({
          width: video.videoWidth,
          height: video.videoHeight
        })
      );
    });
  }
};

exports.getMediaDimensions = getMediaDimensions;

const convertUrlToFile = (url, fileName) => {
  return get(url)
    .then(res => res.arrayBuffer())
    .then(async buffer => new File([ buffer ], fileName, { type: await getMimeType(url) }));
};

exports.convertUrlToFile = convertUrlToFile;

const getObjectURL = async (path, allowedExtensions = [ '.png', '.jpg', '.jpeg', '.webp', '.gif' ]) => {
  if (isString(allowedExtensions) && allowedExtensions !== 'all') {
    allowedExtensions = [ allowedExtensions ];
  }

  const urlObjects = [];

  const isDir = existsSync(path) && lstatSync(path).isDirectory();
  const isFile = existsSync(path) && lstatSync(path).isFile();

  const getURL = async file => {
    const buffer = readFileSync(file);
    const ext = extname(file).slice(1);
    const type = await getMimeType(ext);
    const blob = new Blob([ buffer ], { type });
    const url = URL.createObjectURL(blob);
    const { name } = parse(file);
    /**
     * If it's an image, let's include the width and height
     * as properties to make it easier on the developer.
     */
    let width, height;
    if ([ 'png', 'jpg', 'jpeg', 'webp', 'gif' ].includes(ext)) {
      const dimensions = await getMediaDimensions(url, type);
      ({ width, height } = dimensions);
    }

    if (width && height) {
      return urlObjects.push({
        name,
        url,
        path: file,
        width,
        height,
        type
      });
    }

    return urlObjects.push({
      name,
      url,
      path: file,
      type
    });
  };

  if (isDir) {
    const files = readdirSync(path)
      .filter(file => lstatSync(join(path, file)).isFile() && (allowedExtensions.indexOf(extname(file)) !== -1 || allowedExtensions === 'all'));

    for (const file of files) {
      await getURL(join(path, file));
    }
  } else {
    if (isFile) {
      await getURL(path);
    }
  }

  return urlObjects;
};

exports.getObjectURL = getObjectURL;
