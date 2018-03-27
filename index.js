const path = require('path')
const fs = require('fs')

const EtdFaBuilderError = require('./lib/error')

var filenessCache = { }
var configCache = { }

function isFile(file) {
    if (file in filenessCache) {
        return filenessCache[file]
    }
    var result = fs.existsSync(file) && fs.statSync(file).isFile()
    if (!process.env.ETDFABUILDER_DISABLE_CACHE) {
        filenessCache[file] = result
    }
    return result
}

function eachParent(file, callback) {
    var loc = path.resolve(file)
    do {
        var result = callback(loc)
        if (typeof result !== 'undefined') return result
    } while (loc !== (loc = path.dirname(loc)))
    return undefined
}

function parsePackage(file) {
    var config = JSON.parse(fs.readFileSync(file))
    var list = config.etdfabuilder
    if (typeof list === 'object' && list.length) {
        list = { defaults: list }
    }
    return list
}

function findConfig(from) {
    from = path.resolve(from)

    var cacheKey = isFile(from) ? path.dirname(from) : from
    if (cacheKey in configCache) {
        return configCache[cacheKey]
    }

    var resolved = eachParent(from, function(dir) {
        var pkg = path.join(dir, 'package.json')

        var pkgEtdfabuilder
        if (isFile(pkg)) {
            try {
                pkgEtdfabuilder = parsePackage(pkg)
            } catch (e) {
                if (e.name === 'EtdFaBuilderError') throw e
                console.warn(
                    '[EtdFaBuilder] Could not parse ' + pkg + '. Ignoring it.')
            }
        }

        return pkgEtdfabuilder
    })
    if (!process.env.ETDFABUILDER_DISABLE_CACHE) {
        configCache[cacheKey] = resolved
    }
    return resolved
}

function loadConfig(current_path) {
    if (current_path) {
        return findConfig(current_path)
    } else {
        return undefined
    }
}

module.exports = function(output) {

    const current_path = path.resolve ? path.resolve('.') : '.';
    const config = loadConfig(current_path);

    if (config === undefined) {
        throw new EtdFaBuilderError("Unable to find 'etdfabuilder' config in any package.json");
    }

    let icons = {};
    let js    = '';
    let fa;

    // On parcourt chacune des collections d'icones
    Object.keys(config).forEach(function(key) {

        // On contrôle l'existance du package demandé.
        try {
            fa = require("@fortawesome/fontawesome-" + key);
        } catch (e) {
            throw new EtdFaBuilderError("Unable to find @fortawesome/fontawesome-" + key + " dependency. Please add it to your package.json and install it.")
        }

        let icons_vars = [];
        let icons_obj = [];
        let icons_exports = [];

        // On parcourt les icones demandés dans la collection
        config[key].forEach(function(icon_name) {

            let var_name = 'fa' + icon_name.charAt(0).toUpperCase() + icon_name.slice(1);
            let icon = fa[var_name];

            if (icon === undefined) {
                console.warn(`${icon_name} does not exists in ${key} collection. ignoring it.`);
                return true;
            }

            icons_vars.push(`var ${var_name} = ${JSON.stringify(icon)};`);
            icons_obj.push(`${var_name} = ${var_name}`);
            icons_exports.push(`exports.${var_name} = ${var_name};`);

        });

        js += `

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['fontawesome-${key}'] = {})));
}(this, (function (exports) { 

    var _WINDOW = {};
    try {
      if (typeof window !== 'undefined') _WINDOW = window;
      
    } catch (e) {}
    var _ref = _WINDOW.navigator || {};
    var _ref$userAgent = _ref.userAgent;
    var userAgent = _ref$userAgent === undefined ? '' : _ref$userAgent;
    var WINDOW = _WINDOW;
    var IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');
    var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
    var PRODUCTION = function () {
      try {
        return process.env.NODE_ENV === 'production';
      } catch (e) {
        return false;
      }
    }();
    var oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    var RESERVED_CLASSES = ['xs', 'sm', 'lg', 'fw', 'ul', 'li', 'border', 'pull-left', 'pull-right', 'spin', 'pulse', 'rotate-90', 'rotate-180', 'rotate-270', 'flip-horizontal', 'flip-vertical', 'stack', 'stack-1x', 'stack-2x', 'inverse', 'layers', 'layers-text', 'layers-counter'].concat(oneToTen.map(function (n) {
      return n + 'x';
    })).concat(oneToTwenty.map(function (n) {
      return 'w-' + n;
    }));
    function bunker(fn) {
      try {
        fn();
      } catch (e) {
        if (!PRODUCTION) {
          throw e;
        }
      }
    }
    var w = WINDOW || {};
    if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
    if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
    if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
    if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
    var namespace = w[NAMESPACE_IDENTIFIER];
    
    var _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
    
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    
      return target;
    };
    
    function define(prefix, icons) {
      var normalized = Object.keys(icons).reduce(function (acc, iconName) {
        var icon = icons[iconName];
        var expanded = !!icon.icon;
    
        if (expanded) {
          acc[icon.iconName] = icon.icon;
        } else {
          acc[iconName] = icon;
        }
        return acc;
      }, {});
    
      if (typeof namespace.hooks.addPack === 'function') {
        namespace.hooks.addPack(prefix, normalized);
      } else {
        namespace.styles[prefix] = _extends({}, namespace.styles[prefix] || {}, normalized);
      }
    
      if (prefix === 'fas') {
        define('fa', icons);
      }
    }
    
    var prefix = "${fa.prefix}";
    ${icons_vars.join("\n    ")}
    var icons$1 = {
        ${icons_obj.join(",\n        ")}
    };
    
    bunker(function () {
        define('${fa.prefix}', icons$1);
    });
    
    exports['default'] = icons$1;
    exports.prefix = prefix;
    ${icons_exports.join("\n    ")}
    
    Object.defineProperty(exports, '__esModule', { value: true });

})));

`;

    });

    // On écrit le fichier js
    fs.writeFile(path.resolve(current_path + '/' + output), new Buffer(js), "UTF-8", function(err) {
        if (err) {
            throw new EtdFaBuilderError(err);
        }
    });

}