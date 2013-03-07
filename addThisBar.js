/*!
addThisBar v0.0.1 (http://okize.github.com/)
Copyright (c) 2013 | Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php
*/

;(function (factory) {

  // use AMD or browser globals to create a jQuery plugin.
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }

}(function ($) {

  'use strict';

  // default plugin options
  var pluginName = 'addThisBar';
  var defaults = {
    addThisApiVersion: '300' // 300, 250, 200, 150
  };

  // plugin constructor
  var Bar = function (element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.doc = $(window.document);
    this.addThisScript = '//s7.addthis.com/js/' + this.options.addThisApiVersion + '/addthis_widget.js'; // url of addthis script
    this.addThisConfiguration = {
      pubid: 'ra-4f0c7ed813520536', // change this to whatever profile should be used
      domready: true
    };
    this.addThisScriptCache = {};
    this.init();
  };

  Bar.prototype = {

    init: function() {

      var self = this;

      // load the addthis script
      $.when(this.loadAddthisScript(this.addThisScript)).then(function () {

        window.addthis.bar.show({
          message: 'This is whatever text I feel like adding in here',
          action: {
            'type': 'button',
            'text': 'I am a button!',
            'verb': 'link',
            'url': 'https://github.com/okize'
          }
        });

        window.addthis.bar.initialize({
          'default': {
            backgroundColor: '#333',
            textColor: 'white'
          }
        });

        // addthis.bar.initialize({
        //   default: {
        //     backgroundColor: '#eee',
        //     textColor: '#000'
        //   },
        //   rules: [{
        //     match: {
        //       'service': 'facebook'
        //     },
        //     'message': 'Hey Facebook user! Share my page.',
        //     'action': {
        //       'type': 'button',
        //       'text': 'Share',
        //       'verb': 'share',
        //       'service': 'facebook',
        //       'url': 'http://addthis.com'
        //     }

        //   }, {
        //     match: {
        //       'service': 'twitter'
        //     },
        //     'message': 'Hey Twitter user! Tweet my page.',
        //     'action': {
        //       'type': 'button',
        //       'text': 'Share',
        //       'verb': 'share',
        //       'service': 'twitter',
        //       'url': 'http://addthis.com'
        //     }
        //   }
        //   ]});

        // addthis.bar.initialize([{
        //   'match': {
        //     'time': {'start':'06:00', 'end':'23:40'}
        //   },
        //   'message': 'Wow, it's early! Have a coffee on us',
        //   'action': {
        //     'type': 'button',
        //     'text': 'All right!',
        //     'verb': 'link',
        //     'url': 'http://www.starbucks.com/'
        //   }
        // }
        // ]);

      });

    },

    isAddThisLoaded: function (bool) {

      // if argument is passed then function is setter
      if (arguments.length > 0 && typeof bool === 'boolean') {
        this.doc.data('addThisScriptLoaded', bool);
      }

      // truth in dom; if data attr hasn't been set yet, set it
      if (typeof this.doc.data('addThisScriptLoaded') === 'undefined') {
        this.doc.data('addThisScriptLoaded', false);
        return false;
      }

      return this.doc.data('addThisScriptLoaded');

    },

    setAddThisConfiguration: function() {

      // addthis_config is global to the page so only set it once
      if (this.isAddThisReady() === true && typeof window.addthis_config === 'undefined') {
        window.addthis_config = this.addThisConfiguration;
        window.addthis_share = this.addThisShareConfiguration;
      }

    },

    loadAddthisScript: function (val) {

      // if cache has been set, return promise form these
      // else create new jqXHR object and store it in the cache
      var promise = this.addThisScriptCache[val];
      if (!promise) {

        promise = $.ajax({
          url: this.addThisScript,
          cache: true,
          dataType: 'script'
        });

        this.addThisScriptCache[val] = promise;

      }

      return promise;

    },

    isAddThisReady: function () {

      // check for global addthis object
      // doesn't seem to be a public method for getting version loaded
      // otherwise there should be a check here to compare version loaded is
      // the same as the version requested in the plugin init
      if (typeof window.addthis === 'undefined') {
        return false;
      } else {
        return true;
      }

    }

  };

  // lightweight wrapper around the constructor that prevents multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Bar( this, options ));
      }
    });
  };

}));