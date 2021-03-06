'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.raw = undefined;
exports.default = fileLoader;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
function fileLoader(content) {
  if (!this.emitFile) throw new Error('emitFile is required from module system');

  var query = _loaderUtils2.default.getOptions(this) || {};
  var configKey = query.config || 'fileLoader';
  var options = this.options[configKey] || {};

  var config = {
    publicPath: undefined,
    useRelativePath: false,
    name: '[hash].[ext]'
  };

  // options takes precedence over config
  Object.keys(options).forEach(function (attr) {
    config[attr] = options[attr];
  });

  // query takes precedence over config and options
  Object.keys(query).forEach(function (attr) {
    config[attr] = query[attr];
  });

  var context = config.context || this.options.context;
  var url = _loaderUtils2.default.interpolateName(this, config.name, {
    context,
    content,
    regExp: config.regExp
  });

  var outputPath = '';
  if (config.outputPath) {
    // support functions as outputPath to generate them dynamically
    outputPath = typeof config.outputPath === 'function' ? config.outputPath(url) : config.outputPath;
  }

  var filePath = this.resourcePath;
  if (config.useRelativePath) {
    var issuerContext = this._module && this._module.issuer && this._module.issuer.context || context; // eslint-disable-line no-mixed-operators
    var relativeUrl = issuerContext && _path2.default.relative(issuerContext, filePath).split(_path2.default.sep).join('/');
    var relativePath = relativeUrl && `${_path2.default.dirname(relativeUrl)}/`;
    if (~relativePath.indexOf('../')) {
      // eslint-disable-line no-bitwise
      outputPath = _path2.default.posix.join(outputPath, relativePath, url);
    } else {
      outputPath = relativePath + url;
    }
    url = relativePath + url;
  } else if (config.outputPath) {
    // support functions as outputPath to generate them dynamically
    outputPath = typeof config.outputPath === 'function' ? config.outputPath(url) : config.outputPath + url;
    url = outputPath;
  } else {
    outputPath = url;
  }

  var publicPath = `__webpack_public_path__ + ${JSON.stringify(url)}`;
  if (config.publicPath !== undefined) {
    // support functions as publicPath to generate them dynamically
    publicPath = JSON.stringify(typeof config.publicPath === 'function' ? config.publicPath(url) : config.publicPath + url);
  }

  if (query.emitFile === undefined || query.emitFile) {
    this.emitFile(outputPath, content);
  }

  return `export default ${publicPath};`;
}

var raw = exports.raw = true;