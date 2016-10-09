var SetStyle = function () {
  this.styles = {};
};

SetStyle.prototype.merge = function (name, styleObj) {
  if (!this.styles[name]) {
    return styleObj;
  } else {
    var styles = {};
    for (var prop in this.styles[name]) {
      styles[prop] = this.styles[name][prop];
    }
    for(var prop in styleObj) {
      styles[prop] = styleObj[prop];
    }
  }

  return styles;
};

SetStyle.prototype.set = function ($ele, name, styleObj) {
  styleObj = this.merge(name, styleObj);
  var styleStr = this.toString(name, styleObj);

  if (styleStr !== this.toString(name)) {
    $ele.setAttribute('style', styleStr);
    this.styles[name] = styleObj;
  }
};

SetStyle.prototype.get = function (name, prop, isNumeric) {
  if (!this.styles[name]) {
    return false;
  }
  var styles = this.styles[name];

  if (prop) {
    if (!styles[prop]) {
      return false;
    }
    if (isNumeric) {
      return parseInt(styles[prop].split('px')[0], 10);
    }
    return styles[prop];
  }

  return styles;
};

SetStyle.prototype.toString = function (name, styleObj) {
  var styleStr = [];

  if (!styleObj && this.styles[name]) {
    styleObj = this.styles[name];
  } else if (!styleObj && !this.styles[name]) {
    return '';
  }

  for (var styleProp in styleObj) {
    styleStr.push(styleProp + ':' + styleObj[styleProp]);
  }

  return styleStr.join(';');
};