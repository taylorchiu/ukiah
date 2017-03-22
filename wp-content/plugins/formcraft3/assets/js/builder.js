/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	window.draggedLocation = null;
	window.draggedLocationPage = 0;
	window.helpQuery = [];
	window.helpQueryType = [];
	window.helpPointer = -1;

	toastr.options = {
	  closeButton: false,
	  debug: false,
	  newestOnTop: true,
	  progressBar: false,
	  positionClass: 'toast-top-right',
	  preventDuplicates: false,
	  onclick: null,
	  showDuration: 400,
	  hideDuration: 400,
	  timeOut: 5000,
	  extendedTimeOut: 400,
	  showEasing: 'linear',
	  hideEasing: 'linear',
	  showMethod: 'slideDown',
	  hideMethod: 'slideUp'
	};

	FC.ajaxurl2 = FC.ajaxurl.indexOf('?') > -1 ? FC.ajaxurl + '&' : FC.ajaxurl + '?';

	window.onbeforeunload = function (event) {
	  if (window.lastSaveFieldsNos !== window.lastCheckedFieldsNos) {
	    var message = 'You will lose any un-saved changes.';
	    if (typeof event === 'undefined') {
	      event = window.event;
	    }
	    if (event) {
	      event.returnValue = message;
	    }
	    return message;
	  }
	};

	function builderInit() {
	  jQuery('.fields-list-sortable, .fields-list-sortable > li').sortable({
	    connectWith: '.form-page-content',
	    helper: 'clone',
	    placeholder: 'form-element ui-sortable-placeholder',
	    start: function start(e, ui) {
	      ui.placeholder.width('100%');
	      ui.placeholder.height('56.5px');
	      jQuery(this).find('.ui-sortable-placeholder').after('<div class="button to-remove">' + ui.item[0].innerText + '</div>');
	    },
	    beforeStop: function beforeStop(event, ui) {
	      window.draggedLocation = ui.placeholder.index() - 1;
	      window.draggedLocationPage = ui.placeholder.parents('.form-page').index();
	      if (ui.placeholder.parents('.form-page-content').length === 1) {
	        jQuery(ui.item).trigger('click');
	      }
	      jQuery(this).sortable('cancel');
	      jQuery('.button.to-remove').remove();
	    },
	    stop: function stop() {
	      jQuery(this).sortable('cancel');
	    }
	  }).disableSelection();
	}

	function getURLParameter(name) {
	  return decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null;
	}

	function applySelectFix(id, value) {
	  setTimeout(function () {
	    jQuery('#' + id).val(value);
	  }, 500);
	}

	function shadeColor(color, percent) {

	  if (typeof color === 'undefined') {
	    return '#666666';
	  }

	  var R = parseInt(color.substring(1, 3), 16);
	  var G = parseInt(color.substring(3, 5), 16);
	  var B = parseInt(color.substring(5, 7), 16);

	  R = parseInt(R * (100 + percent) / 100, 10);
	  G = parseInt(G * (100 + percent) / 100, 10);
	  B = parseInt(B * (100 + percent) / 100, 10);

	  R = R < 255 ? R : 255;
	  G = G < 255 ? G : 255;
	  B = B < 255 ? B : 255;

	  var RR = R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
	  var GG = G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
	  var BB = B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

	  return '#' + (RR + GG + BB);
	}

	function loadAddons() {
	  jQuery('.new-addons').html('<i class="animate-spin icon-spin5"></i>');
	  jQuery.ajax({
	    url: FC.ajaxurl2 + 'action=formcraft3_get&URL=' + encodeURIComponent('http://formcraft-wp.com/?type=get_addons&key=' + FC.licenseKey),
	    type: 'GET',
	    context: jQuery(this),
	    cache: false,
	    dataType: 'json'
	  }).done(function (response) {
	    if (response.failed) {
	      toastr.error(response.failed);
	      jQuery('.new-addons').html('');
	      return false;
	    }
	    var html = '';
	    var addons = [];
	    addons.free = [];
	    addons.purchased = [];
	    addons.other = [];
	    for (var x in response.addons) {
	      if (jQuery('.addon-id-' + response.addons[x].ID).length > 0) {
	        continue;
	      }
	      if (response.addons[x].price === 0) {
	        addons.free.push(response.addons[x]);
	      } else if (response.addons[x].purchased === true) {
	        addons.purchased.push(response.addons[x]);
	      } else {
	        addons.other.push(response.addons[x]);
	      }
	    }
	    var nos = 0;
	    var addonType = void 0;
	    for (var type in addons) {
	      if (addons[type].length === 0) {
	        continue;
	      }
	      if (type === 'free') {
	        addonType = 'Free';
	      }
	      if (type === 'purchased') {
	        addonType = 'Purchased';
	      }
	      if (type === 'other') {
	        addonType = 'Paid';
	      }
	      html = html + '<div class="addon-type">' + addonType + '</div>';
	      for (var addon in addons[type]) {
	        if (_typeof(addons[type][addon]) !== 'object') {
	          continue;
	        }
	        addons[type][addon].price = parseInt(addons[type][addon].price, 10);
	        var button = void 0;
	        if (addons[type][addon].price === 0 || addons[type][addon].purchased === true) {
	          button = '<br><button class="toggle-install button blue small" data-plugin="' + addons[type][addon].ID + '" class="install-plugin-btn"><span>Install Plugin</span><i class="icon-spin5 animate-spin"></i></button><a class="read-more-addon" href="http://formcraft-wp.com/addons/?page_id=' + addons[type][addon].ID + '" target="_blank">read more</a>';
	        } else {
	          button = '<br><a target="_blank" href="http://formcraft-wp.com/buy/?addons=' + addons[type][addon].ID + '&key=' + FC.licenseKey + '" class=\'button purchase small\' class=\'install-plugin-btn\'><span>Purchase for $' + addons[type][addon].price + '</span></a><a class="read-more-addon" href="http://formcraft-wp.com/addons/?page_id=' + addons[type][addon].ID + '" target="_blank">read more</a>';
	        }
	        html = html + '<div class="addon"><div class="addon-head ac-toggle"><div class="addon-logo-cover"><img class="addon-logo" src="' + addons[type][addon].logo + '"/></div><span class="addon-title">' + addons[type][addon].addon_name + '</span><span class="toggle-angle"><i class="icon-angle-down"></i><i class="icon-angle-up"></i></span></div><div class="addon-content ac-inner addon-excerpt">' + (addons[type][addon].addon_description.replace(/-&gt;/g, '→') + button) + '</div></div>';
	        nos += 1;
	      }
	    }
	    if (nos === 0) {
	      html = '<div class=\'no-addons\'>Nothing Left To Install</div>';
	    }
	    jQuery('.new-addons').html(html);
	  }).fail(function () {
	    jQuery('.new-addons').html('');
	    toastr.error('Please check your internet connection');
	  });
	}

	function updateHelp(query, type, log) {
	  jQuery('#help-content').addClass('loading');
	  jQuery.ajax({
	    url: FC.ajaxurl2 + 'action=formcraft3_get&URL=' + encodeURIComponent(query),
	    type: 'GET',
	    context: jQuery(this),
	    cache: false,
	    dataType: 'json'
	  }).done(function (response) {
	    if (response.failed) {
	      jQuery('#help-content-content').html('<div style="line-height:normal;letter-spacing:0px;font-size:1.5em;margin:50px 0;text-align:center">Something broke: <br>' + response.failed + '</div>');
	      return false;
	    }
	    if (log === true) {
	      window.helpQuery.push([query, type]);
	      window.helpPointer += 1;
	    }
	    var html = '<div id="help-top"><span id="help-back">← back</span><span id="help-home">Index</span><span class="close" data-dismiss="fc_modal" aria-label="Close">close</span></div>';
	    if (type === 'categories') {
	      var htmlListElement = '';
	      if (query.indexOf('search=') !== -1) {
	        var search = query.split('search=');
	        html = html + '<h2>Search: ' + search[search.length - 1] + '</h2><div style="padding-top:3%; overflow: auto; height: 475px; padding-bottom: 10%">';
	      } else {
	        html = html + '<h2>Help Topics</h2><div style="padding-top:3%; overflow: auto; height: 475px; padding-bottom: 10%">';
	      }
	      var HTMLarray = [];
	      if (response.length === 0) {
	        html = html + '<div class="no-posts"><i class="icon-emo-unhappy"></i> Sorry, nothing here</div>';
	      } else {
	        for (var x in response) {
	          var ID = void 0;
	          for (var i in response[x].terms.group) {
	            ID = response[x].terms.group[i].slug;
	            break;
	          }
	          HTMLarray[response[x].terms.group[0].name] = HTMLarray[response[x].terms.group[0].name] || [];
	          HTMLarray[response[x].terms.group[0].name].push(['<div class="post" data-id="' + response[x].ID + '">' + response[x].title + '</div>', ID]);
	        }
	        for (var _y in HTMLarray) {
	          html = html + '<h3 class="category" data-id="' + HTMLarray[_y][0][1] + '">' + _y + '</h3>';
	          htmlListElement = htmlListElement + '<li class="category" data-id="' + HTMLarray[_y][0][1] + '">' + _y + '</li>';
	          var current = 0;
	          for (var z in HTMLarray[_y]) {
	            if (current === 6) {
	              break;
	            }
	            current += 1;
	            html = html + HTMLarray[_y][z][0];
	          }
	        }
	        htmlListElement = htmlListElement + '<li><a style="box-shadow:none;outline:none;color:inherit;text-decoration:none;margin:-8px -12px;display: block;height: 34px;line-height: 34px;padding-left: 12px;" target="_blank" href="http://formcraft-wp.com/support">Contact Support</a></li>';
	      }
	      if (jQuery('#help-menu ul').html().trim() === '') {
	        jQuery('#help-menu ul').html(htmlListElement);
	      }
	      html = html + '</div>';
	    } else if (type === 'posts') {
	      html = html + '<h2>' + response[0].terms.group[0].name + '</h2><div style="padding-top:3%; overflow: auto; max-height: 100%; padding-bottom: 10%">';
	      for (var _x in response) {
	        html = html + '<div class="post" data-id="' + response[_x].ID + '">' + response[_x].title + '</div>';
	      }
	      html = html + '</div>';
	    } else if (type === 'post') {
	      response.content = response.content.replace(/<pre>/g, '<code class="code">').replace(/<pre/g, '<code class="code"').replace(/<\/pre>/g, '</code>').replace(/-&gt;/g, '→');
	      html = html + '<h2>' + response.title + '</h2><article>' + response.content + '</article>';
	    }
	    jQuery('#help-content-content').html(html);
	    jQuery('#help-content-content code').each(function (i, block) {
	      hljs.highlightBlock(block);
	    });
	  }).fail(function () {
	    toastr.error('Please check your internet connection');
	  }).always(function () {
	    jQuery('#help-content').removeClass('loading');
	    if (window.helpPointer === 0) {
	      jQuery('#help-top').addClass('disabled');
	    } else {
	      jQuery('#help-top').removeClass('disabled');
	    }
	  });
	}

	jQuery(document).mouseup(function (e) {
	  jQuery('.icons-list').each(function () {
	    var container = jQuery(this);
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if (container.find('.hide-checkbox.ng-hide').length === 0) {
	        container.find('div span:nth-child(2)').trigger('click');
	      }
	    }
	  });
	});

	jQuery(document).ready(function () {

	  jQuery('body').on('click', '.single-option textarea', function () {
	    event.preventDefault();
	  });

	  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	  jQuery('.option-box').css('height', h - 71 + 'px');
	  jQuery('.option-box .nav-content-slide > div').css('height', h - 71 - 63 + 'px');
	  jQuery('body').addClass('formcraft-css');
	  jQuery('body').on('change', '.update-label label input', function () {
	    if (jQuery(this).is(':checked')) {
	      var name = jQuery(this).attr('name');
	      jQuery('[name="' + name + '"]').parent().removeClass('active');
	      jQuery(this).parent().addClass('active');
	    }
	  });
	  jQuery('body').on('focus', '.meridian-picker', function () {
	    if (jQuery(this).val() === 'am') {
	      jQuery(this).val('pm');
	    } else if (jQuery(this).val() === 'pm') {
	      jQuery(this).val('am');
	    } else {
	      jQuery(this).val('am');
	    }
	    jQuery(this).blur();
	    jQuery(this).trigger('input');
	  });

	  jQuery('body').on('focus', '.password-cover input[type="password"],.oneLineText-cover input[type="text"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.textarea-cover textarea,.dropdown-cover select', function () {
	    jQuery(this).parents('.field-cover').addClass('has-focus');
	  });

	  jQuery('body').on('blur', '.password-cover input[type="password"],.oneLineText-cover input[type="text"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.textarea-cover textarea,.dropdown-cover select', function () {
	    jQuery(this).parents('.field-cover').removeClass('has-focus');
	  });

	  jQuery('body').on('change', '.dropdown-cover select', function () {
	    if (jQuery(this).find('option:checked').length > 0 && jQuery(this).find('option:checked').text() !== '') {
	      jQuery(this).parents('.field-cover').addClass('has-input');
	    } else {
	      jQuery(this).parents('.field-cover').removeClass('has-input');
	    }
	  });

	  jQuery('body').on('input', '.oneLineText-cover input[type="text"],.password-cover input[type="password"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.textarea-cover textarea', function () {
	    if (jQuery(this).val().length > 0 || jQuery(this).attr('placeholder').length > 0) {
	      jQuery(this).parents('.field-cover').addClass('has-input');
	    } else {
	      jQuery(this).parents('.field-cover').removeClass('has-input');
	    }
	  });

	  setTimeout(function () {
	    jQuery('.oneLineText-cover input[type="text"],.password-cover input[type="password"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.textarea-cover textarea').trigger('input');
	  }, 1000);

	  jQuery('body').on('click', '.toggle-install', function () {
	    jQuery(this).addClass('loading').attr('disabled', 'disabled');
	    jQuery.ajax({
	      url: FC.ajaxurl,
	      type: 'POST',
	      context: jQuery(this),
	      data: 'action=formcraft3_install_plugin&plugin=' + jQuery(this).attr('data-plugin'),
	      dataType: 'json'
	    }).done(function (response) {
	      if (response.failed) {
	        toastr.error(response.failed);
	        jQuery(this).removeClass('loading').removeAttr('disabled');
	      } else if (response.success) {
	        window.pluginInstalled = response.plugin;
	        jQuery('#plugin-save').trigger('click');
	      } else {
	        toastr.error('Unknown Error.');
	        jQuery(this).removeClass('loading').removeAttr('disabled');
	      }
	    }).fail(function () {
	      toastr.error('Unknown Error');
	      jQuery(this).removeClass('loading').removeAttr('disabled');
	    });
	  });
	  jQuery('body').on('click', '.ac-toggle', function (e) {
	    e.preventDefault();
	    var jQthis = jQuery(this);
	    if (jQthis.next()[0].classList.contains('show')) {
	      jQthis.next().removeClass('show');
	      jQthis.next().slideUp(300);
	      jQthis.removeClass('active');
	    } else {
	      jQthis.parent().parent().find('.ac-inner').removeClass('show');
	      jQthis.parent().parent().find('.ac-inner').slideUp(300);
	      jQthis.parent().parent().find('.ac-toggle').removeClass('active');
	      jQthis.next().toggleClass('show');
	      jQthis.next().slideToggle(300);
	      jQthis.addClass('active');
	    }
	  });
	  jQuery('.simple-toggle').click(function () {
	    var jQthis = jQuery(this);
	    if (jQthis.next()[0].classList.contains('show')) {
	      jQthis.next().removeClass('show');
	      jQthis.next().slideUp(300);
	      jQthis.removeClass('active');
	    } else {
	      jQthis.parent().parent().find('.simple-inner').removeClass('show');
	      jQthis.parent().parent().find('.simple-inner').slideUp(300);
	      jQthis.parent().parent().find('.simple-toggle').removeClass('active');
	      jQthis.next().toggleClass('show');
	      jQthis.next().slideToggle(300);
	      jQthis.addClass('active');
	    }
	  });
	  jQuery('body').on('click', '.form-cover-builder', function (event) {
	    if (jQuery(event.target).parents('.fc-form').length === 0) {
	      jQuery('.iris-picker').hide();
	      if (jQuery('#form_styling_box').hasClass('state-true')) {
	        jQuery('#form_styling_button').trigger('click');
	      }
	      if (jQuery('#form_addon_box').hasClass('state-true')) {
	        jQuery('#form_addons_button').trigger('click');
	      }
	      if (jQuery('#form_options_box').hasClass('state-true')) {
	        jQuery('#form_options_button').trigger('click');
	      }
	      if (jQuery('#form_logic_box').hasClass('state-true')) {
	        jQuery('#form_logic_button').trigger('click');
	      }
	      jQuery('.options-true .form-element-html').trigger('click');
	    }
	  });
	  updateHelp('http://formcraft-wp.com/wp-json/posts/?type=help&filter[posts_per_page]=50&filter[order]=ASC', 'categories', true);
	  jQuery('body').on('click', '.trigger-help', function () {
	    jQuery('#help-content-content').html('.');
	    jQuery('.fc_modal').fc_modal('hide');
	    jQuery('#help_modal').fc_modal('show');
	    window.helpPointer = window.helpQuery.length - 1;
	    updateHelp('http://formcraft-wp.com/wp-json/posts/' + jQuery(this).attr('data-post-id') + '/?type=help', 'post', true);
	  });
	  jQuery('body').on('submit', '#help-search', function () {
	    window.helpPointer = window.helpQuery.length - 1;
	    updateHelp('http://formcraft-wp.com/wp-json/posts/?type=help&filter[posts_per_page]=50&filter[s]=' + jQuery(this).find('input').val(), 'categories', true);
	  });
	  jQuery('body').on('click', '#help_modal .category', function () {
	    jQuery('#help_modal .category.active').removeClass('active');
	    jQuery('.category[data-id="' + jQuery(this).attr('data-id') + '"]').addClass('active');
	    window.helpPointer = window.helpQuery.length - 1;
	    updateHelp('http://formcraft-wp.com/wp-json/posts/?type=help&filter[posts_per_page]=50&filter[order]=ASC&filter[group]=' + jQuery(this).attr('data-id'), 'posts', true);
	  });
	  jQuery('body').on('click', '#help-content-content .post, #help-content-content .trigger-post', function (event) {
	    event.preventDefault();
	    window.helpPointer = window.helpQuery.length - 1;
	    updateHelp('http://formcraft-wp.com/wp-json/posts/' + jQuery(this).attr('data-id') + '/?type=help', 'post', true);
	  });
	  jQuery('body').on('click', '#help-back', function () {
	    if (typeof window.helpQuery !== 'undefined' && !jQuery(this).parent().hasClass('disabled')) {
	      window.helpPointer = window.helpPointer - 1;
	      window.helpQuery.splice(window.helpPointer + 1, window.helpQuery.length);
	      updateHelp(window.helpQuery[window.helpPointer][0], window.helpQuery[window.helpPointer][1], false);
	    }
	  });
	  jQuery('body').on('click', '#help-home', function () {
	    window.helpPointer = window.helpQuery.length - 1;
	    updateHelp('http://formcraft-wp.com/wp-json/posts/?type=help&filter[posts_per_page]=50&filter[order]=ASC', 'categories', true);
	  });
	  jQuery('#help_modal').on('shown.bs.fc_modal', function () {
	    if (jQuery('#help-content-content').html().trim() === '') {
	      window.helpPointer = window.helpQuery.length - 1;
	      updateHelp('http://formcraft-wp.com/wp-json/posts/?type=help&filter[posts_per_page]=50&filter[order]=ASC', 'categories', true);
	    }
	  });
	  jQuery('body').on('focus', '.wp-picker-input-wrap .color-picker', function () {
	    jQuery(this).parent().find('.wp-color-picker').trigger('change');
	  });
	  jQuery('body').on('change', '.star-cover label input', function () {
	    if (jQuery(this).is(':checked')) {
	      var name = jQuery(this).attr('name');
	      jQuery('[name="' + name + '"]').parent().removeClass('active');
	      jQuery(this).parent().addClass('active');
	      var index = jQuery(this).parent().index();
	      jQuery(this).parent().parent().find('label').removeClass('fake-click');
	      jQuery(this).parent().parent().find('label').slice(0, index + 1).addClass('fake-click');
	    }
	  });
	  jQuery('.fake-hover').hover(function () {
	    jQuery(this).addClass('hover-true');
	  }, function () {
	    setTimeout(function () {
	      jQuery('.fake-hover').removeClass('hover-false');
	    }, 200);
	    jQuery(this).removeClass('hover-true');
	    jQuery(this).addClass('hover-false');
	  });
	  jQuery('[data-toggle="tooltip"]').tooltip({ html: true });
	  jQuery('body').on('change', '.parent-toggle', function () {
	    var name = jQuery(this).attr('name');
	    jQuery('[name="' + name + '"]').parent().removeClass('active');
	    jQuery('[name="' + name + '"]:checked').parent().addClass('active');
	  });
	  jQuery('body').on('click', '.nav-tabs > span', function () {
	    var selector = jQuery(this).parent().attr('data-content');
	    jQuery(this).parent().find('> span').removeClass('active');
	    jQuery(this).addClass('active');
	    jQuery(selector).find(' > div').removeClass('active');
	    jQuery(selector).find(' > div').eq(jQuery(this).index()).addClass('active');
	  });
	  jQuery('body').on('click', '.nav-tabs-slide > span', function () {
	    var selector = jQuery(this).parent().attr('data-content');
	    var left = void 0;
	    jQuery(this).parent().find('> span').removeClass('active');
	    jQuery(this).addClass('active');
	    if (window.isRTL === true || jQuery('body').hasClass('rtl')) {
	      left = parseInt(jQuery(this).index(), 10) * 100 + '%';
	    } else {
	      left = '-' + parseInt(jQuery(this).index(), 10) * 100 + '%';
	    }
	    jQuery(selector).css('-webkit-transform', 'translate3d(' + left + ', 0px, 0px)');
	    jQuery(selector).css('transform', 'translate3d(' + left + ', 0px, 0px)');
	    jQuery(selector).find(' > div').removeClass('active');
	    jQuery(selector).find(' > div').eq(jQuery(this).index()).addClass('active');
	    setTimeout(function () {
	      var ta = document.querySelector('#success-message');
	      var evt = document.createEvent('Event');
	      evt.initEvent('autosize.update', true, false);
	      ta.dispatchEvent(evt);
	    }, 200);
	    if (jQuery(selector).find(' > div').eq(jQuery(this).index()).hasClass('new-addons') && jQuery(selector).find(' > div').eq(jQuery(this).index()).html().trim() === '') {
	      loadAddons();
	    }
	  });
	});

	function saveFormJQuery(builder, addons, addField, callback) {
	  var meta_builder = {};
	  meta_builder.fields = [];
	  meta_builder.config = builder.Config;

	  for (var page in builder.FormElements) {
	    for (var element in builder.FormElements[page]) {
	      if (typeof builder.FormElements[page][element].elementDefaults === 'undefined') {
	        continue;
	      }
	      var isPayment = false;
	      for (var x in addField.payments) {
	        isPayment = addField.payments[x].name === builder.FormElements[page][element].type ? true : isPayment;
	      }
	      meta_builder.fields.push({
	        identifier: builder.FormElements[page][element].elementDefaults.identifier,
	        type: builder.FormElements[page][element].type,
	        elementDefaults: builder.FormElements[page][element].elementDefaults,
	        page: parseInt(page, 10) + 1,
	        isPayment: isPayment
	      });
	      meta_builder.emailRecipients = typeof builder.Config.notifications.recipients === 'undefined' ? '' : builder.Config.notifications.recipients;
	    }
	  }
	  window.lastSaveFieldsNos = meta_builder.fields.length;
	  meta_builder.pageCount = builder.FormElements.length;
	  if (jQuery('.fc-form .customText-cover').length !== 0) {
	    jQuery('.fc-form .customText-cover img').each(function () {
	      var height = jQuery(this).attr('height');
	      jQuery(this).css('height', height + 'px');
	      var width = jQuery(this).attr('width');
	      jQuery(this).css('width', width + 'px');
	    });
	  }
	  if (jQuery('.fc-form .textarea-cover').length !== 0) {
	    jQuery('.fc-form .textarea-cover textarea').each(function () {
	      jQuery(this).css('min-height', jQuery(this).outerHeight() + 'px');
	    });
	  }
	  if (jQuery('.fc-form .datepicker-cover').length !== 0) {
	    jQuery('.fc-form .datepicker-cover input').each(function () {
	      jQuery(this).removeAttr('id');
	    });
	  }

	  meta_builder = encodeURIComponent(angular.toJson(meta_builder));
	  builder = encodeURIComponent(deflate(angular.toJson(builder)));
	  addons = encodeURIComponent(angular.toJson(addons));
	  var html = jQuery('#form-cover-html').html().trim();

	  if (jQuery('.fc-form .textarea-cover').length !== 0) {
	    jQuery('.fc-form .textarea-cover textarea').each(function () {
	      jQuery(this).css('min-height', '0');
	    });
	  }

	  html = html.replace(/ng-repeat="[^"]*"/g, '');
	  html = html.replace(/ng-class="[^"]*"/g, '');
	  html = html.replace(/ng-click="[^"]*"/g, '');
	  html = html.replace(/ng-class-odd="[^"]*"/g, '');
	  html = html.replace(/ng-init="[^"]*"/g, '');
	  html = html.replace(/ui-sortable="[^"]*"/g, '');
	  html = html.replace(/watch-show-options="[^"]*"/g, '');
	  html = html.replace(/ng-class-even="[^"]*"/g, '');
	  html = html.replace(/ng-model="[^"]*"/g, '');
	  html = html.replace(/ondrop="[^"]*"/g, '');
	  html = html.replace(/dnd-list="[^"]*"/g, '');
	  html = html.replace(/compile="[^"]*"/g, '');
	  html = html.replace(/<!--RFH-->[\s\S]*?<!--RTH-->/g, '');
	  html = html.replace(/<!-- end ngRepeat: page in Builder.FormElements -->/g, '');
	  html = html.replace(/<!-- ngRepeat: page in Builder.FormElements -->/g, '');
	  html = html.replace(/<!-- end ngRepeat: element in page -->/g, '');
	  html = html.replace(/<!-- ngRepeat: element in page -->/g, '');

	  html = minify(html, {
	    removeComments: false,
	    removeEmptyAttributes: true
	  });

	  html = html.replace(/ng-binding/g, '');
	  html = html.replace(/ng-scope/g, '');
	  html = html.replace(/ng-dirty/g, '');
	  html = html.replace(/ui-sortable/g, '');
	  html = html.replace(/ui-sortable-handle/g, '');
	  html = html.replace(/ng-valid-parse/g, '');
	  html = html.replace(/class=""/g, '');
	  html = html.replace(/ng-untouched/g, '');
	  html = html.replace(/ng-valid/g, '');
	  html = encodeURIComponent(html);

	  var data = 'builder=' + builder + '&addons=' + addons + '&id=' + jQuery('#form_id').val() + '&html=' + html + '&meta_builder=' + meta_builder;

	  jQuery('#form_save_button').attr('disabled', 'disabled');
	  jQuery('#form_save_button').addClass('saving');
	  jQuery.ajax({
	    url: FC.ajaxurl,
	    type: 'POST',
	    context: jQuery(this),
	    data: 'action=formcraft3_form_save&' + data,
	    dataType: 'json'
	  }).done(function (response) {
	    if (response.failed) {
	      toastr.error(response.failed);
	    } else if (response.success) {
	      toastr.success('<i class="icon-ok"></i> ' + response.success);
	      callback(true);
	    } else {
	      toastr.error('Failed Saving. Unknown Error.');
	    }
	  }).fail(function (response, status, code) {
	    if (code === 'Forbidden') {
	      toastr.error('Failed Saving. Please try disabing your firewall, or security plugin.');
	    } else {
	      toastr.error('Failed Saving');
	    }
	  }).always(function () {
	    jQuery('#form_save_button').removeClass('saving');
	    jQuery('#form_save_button').removeAttr('disabled');
	  });
	}

	window.FormCraftApp = angular.module('FormCraft', ['textAngular', 'ui.sortable']);

	FormCraftApp.directive('compile', function ($compile) {
	  return function (scope, element, attrs) {
	    scope.$watch(function (scope) {
	      return scope.$eval(attrs.compile);
	    }, function (value) {
	      element.html(value);
	      $compile(element.contents())(scope);
	    });
	  };
	});

	FormCraftApp.directive('updateLabel', function () {
	  return {
	    require: 'ngModel',
	    link: function link($scope, $element, $attrs) {
	      $scope.$watch($attrs.ngModel, function () {
	        if ($element[0].checked === true) {
	          $element.parent().addClass('active');
	        } else {
	          $element.parent().removeClass('active');
	        }
	      });
	    }

	  };
	});

	FormCraftApp.directive('watchShowOptions', function () {
	  return function ($scope, $element, $attrs) {
	    $attrs.$observe('watchShowOptions', function innerObserveFunction() {

	      $scope.element.showOptionsAnimate = $scope.element.showOptionsAnimate || false;
	      if (typeof $scope.element.showOptions === 'undefined') {
	        $scope.isShowPristine = false;
	      }
	      if ($scope.element.showOptions === false && $scope.element.showOptionsAnimate !== false) {
	        $scope.element.showOptionsAnimate = 'hiding';
	        setTimeout(function () {
	          $scope.$apply(function () {
	            $scope.element.showOptionsAnimate = false;
	          });
	        }, 250);
	      } else {
	        $scope.element.showOptionsAnimate = true;
	      }

	      if ($scope.element.showOptions === true) {
	        $scope.element.showOptionsAnimate = true;
	      }

	      $scope.isShowPristine = typeof $scope.isShowPristine === 'undefined';
	      if ($attrs.watchShowOptions === 'true' && $scope.isShowPristine === false) {
	        for (var x in $scope.$parent.$parent.Builder.FormElements) {
	          for (var _y2 in $scope.$parent.$parent.Builder.FormElements[x]) {
	            if (typeof $scope.$parent.$parent.Builder.FormElements[x][_y2].showOptions === 'undefined') {
	              continue;
	            }
	          }
	        }
	      }
	    });
	  };
	});

	FormCraftApp.directive('selectFields', function () {
	  return function ($scope, $element, $attrs) {
	    $scope.$watch('listOfFields', function () {
	      setTimeout(function () {
	        var instance = $element[0].selectize;
	        if (typeof instance !== 'undefined') {
	          instance.destroy();
	        }
	        $element.selectize({
	          valueField: 'identifier',
	          labelField: 'label',
	          sortField: 'text',
	          openOnFocus: true,
	          preload: true,
	          options: $scope.listOfFields,
	          onChange: function onChange() {
	            var placeholder = $attrs.placeholder;
	            if (typeof placeholder !== 'undefined') {
	              $element.parent().find('.selectize-input > input').attr('placeholder', placeholder);
	            }
	          }
	        });
	        var placeholder = $attrs.placeholder;
	        if (typeof placeholder !== 'undefined') {
	          $element.parent().find('.selectize-input > input').attr('placeholder', placeholder);
	        }
	      }, 500);
	    });
	  };
	});

	FormCraftApp.directive('ngSlideToggle', function () {
	  return function ($scope, $element, $attrs) {
	    $scope.$watch($attrs.ngSlideToggle, function (e) {
	      if (typeof e === 'undefined' || e === false) {
	        $element.slideUp(250);
	      } else {
	        $element.slideDown(250);
	      }
	    });
	  };
	});

	FormCraftApp.directive('checkboxList', function () {
	  return {
	    require: 'ngModel',
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      $scope.$watch($attrs.ngModel, function () {
	        if (typeof $scope.element.elementDefaults.optionsListShow === 'undefined') {
	          $scope.isPristine = false;
	        }
	        if (typeof $scope.isPristine === 'undefined' || $scope.isPristine === true) {
	          $scope.isPristine = false;
	          return false;
	        }
	        var temp = void 0;
	        if (typeof ngModelCtrl.$modelValue === 'number') {
	          temp = $scope.element.elementDefaults.options_list.split('\n');
	        } else {
	          temp = ngModelCtrl.$modelValue.split('\n');
	        }
	        $scope.element.elementDefaults.optionsListShow = temp.map(function (x) {
	          return x.indexOf('==') === -1 ? { value: x, show: x } : { value: x.split('==')[0], show: x.split('==')[1] };
	        });
	      });
	    }
	  };
	});

	FormCraftApp.directive('matrixRows', function () {
	  return {
	    require: 'ngModel',
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      $scope.$watch($attrs.ngModel, function () {
	        if (typeof $scope.element.elementDefaults.matrixRowsOutput === 'undefined') {
	          $scope.isPristineRows = false;
	        }
	        if (typeof $scope.isPristineRows === 'undefined' || $scope.isPristineRows === true) {
	          $scope.isPristineRows = false;
	          return false;
	        }
	        var temp = void 0;
	        if (typeof ngModelCtrl.$modelValue === 'number') {
	          temp = $scope.element.elementDefaults.matrix_rows.split('\n');
	        } else {
	          temp = ngModelCtrl.$modelValue.split('\n');
	        }
	        $scope.element.elementDefaults.matrixRowsOutput = temp.map(function (x) {
	          return { value: x };
	        });
	      });
	    }

	  };
	});

	FormCraftApp.directive('matrixCols', function () {
	  return {
	    require: 'ngModel',
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      $scope.$watch($attrs.ngModel, function () {
	        var temp = void 0;

	        if (typeof $scope.element.elementDefaults.matrixColumnsOutput === 'undefined') {
	          $scope.isPristineCols = false;
	        }
	        if (typeof $scope.isPristineCols === 'undefined' || $scope.isPristineCols === true) {
	          $scope.isPristineCols = false;
	          return false;
	        }
	        if (typeof $scope.element.elementDefaults.matrix_cols === 'undefined') {
	          $scope.element.elementDefaults.matrix_cols = $scope.element.elementDefaults.options_list;
	          delete $scope.element.elementDefaults.options_list;
	          temp = $scope.element.elementDefaults.matrix_cols.split('\n');
	        } else if (typeof ngModelCtrl.$modelValue === 'number') {
	          temp = $scope.element.elementDefaults.matrix_cols.split('\n');
	        } else {
	          temp = ngModelCtrl.$modelValue.split('\n');
	        }
	        $scope.element.elementDefaults.matrixColumnsOutput = temp.map(function (x) {
	          return { value: x };
	        });
	      });
	    }

	  };
	});

	FormCraftApp.directive('imageList', function () {
	  return {
	    require: 'ngModel',
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      $scope.$watch($attrs.ngModel, function () {
	        if ($scope.element.elementDefaults.allow_images === true) {
	          var temp = ngModelCtrl.$modelValue.split('\n');
	          $scope.element.elementDefaults.imagesListShow = temp.map(function (x) {
	            return { url: x };
	          });
	        } else {
	          $scope.element.elementDefaults.imagesListShow = [];
	        }
	      });
	    }
	  };
	});

	FormCraftApp.directive('updateHours', function () {
	  return {
	    link: function link($scope, $element, $attrs) {
	      $attrs.$observe('hrsMin', function innerObserveFunction() {
	        var min = parseInt($attrs.hrsMin, 10);
	        min = Math.max(min, 0);
	        var max = parseInt($attrs.hrsMax, 10);
	        max = Math.min(max, 24);
	        var step = parseInt($attrs.hrsStep, 10);
	        step = Math.max(1, step);

	        min = isNaN(min) ? 0 : min;
	        max = isNaN(max) ? 24 : max;
	        step = isNaN(step) ? 1 : step;
	        var stop = false;
	        var i = min;
	        var a = 0;
	        $scope.element.elementDefaults.hoursRange = [];
	        while (stop === false) {
	          a += 1;
	          var padded = ('0' + i).substr(-2, 2);
	          $scope.element.elementDefaults.hoursRange.push(padded);
	          i = i + step;
	          if (i > max) {
	            stop = true;
	          }
	          if (a === 24) {
	            stop = true;
	          }
	        }
	      });
	      $attrs.$observe('hrsMax', function innerObserveFunction() {
	        var min = parseInt($attrs.hrsMin, 10);
	        min = Math.max(min, 0);
	        var max = parseInt($attrs.hrsMax, 10);
	        max = Math.min(max, 24);
	        var step = parseInt($attrs.hrsStep, 10);
	        step = Math.max(1, step);

	        min = isNaN(min) ? 0 : min;
	        max = isNaN(max) ? 24 : max;
	        step = isNaN(step) ? 1 : step;
	        var stop = false;
	        var i = min;
	        var a = 0;
	        $scope.element.elementDefaults.hoursRange = [];
	        while (stop === false) {
	          a += 1;
	          var padded = ('0' + i).substr(-2, 2);
	          $scope.element.elementDefaults.hoursRange.push(padded);
	          i = i + step;
	          if (i > max) {
	            stop = true;
	          }
	          if (a === 24) {
	            stop = true;
	          }
	        }
	      });
	      $attrs.$observe('hrsStep', function innerObserveFunction() {
	        var min = parseInt($attrs.hrsMin, 10);
	        min = Math.max(min, 0);
	        var max = parseInt($attrs.hrsMax, 10);
	        max = Math.min(max, 24);
	        var step = parseInt($attrs.hrsStep, 10);
	        step = Math.max(1, step);

	        min = isNaN(min) ? 0 : min;
	        max = isNaN(max) ? 24 : max;
	        step = isNaN(step) ? 1 : step;
	        var stop = false;
	        var i = min;
	        var a = 0;
	        $scope.element.elementDefaults.hoursRange = [];
	        while (stop === false) {
	          a += 1;
	          var padded = ('0' + i).substr(-2, 2);
	          $scope.element.elementDefaults.hoursRange.push(padded);
	          i = i + step;
	          if (i > max) {
	            stop = true;
	          }
	          if (a === 24) {
	            stop = true;
	          }
	        }
	      });
	    }

	  };
	});

	FormCraftApp.directive('updateMinutes', function () {
	  return {
	    link: function link($scope, $element, $attrs) {
	      $attrs.$observe('minuteStep', function innerObserveFunction() {
	        var step = parseInt($attrs.minuteStep, 10);
	        step = Math.max(1, step);
	        step = Math.min(60, step);
	        step = isNaN(step) ? 30 : step;

	        var stop = false;
	        var i = 0;
	        var a = 0;
	        $scope.element.elementDefaults.minute_range = [];
	        while (stop === false) {
	          a += 1;
	          var padded = ('0' + i).substr(-2, 2);
	          $scope.element.elementDefaults.minute_range.push(padded);
	          i = i + step;
	          if (i >= 60) {
	            stop = true;
	          }
	          if (a === 60) {
	            stop = true;
	          }
	        }
	      });
	    }

	  };
	});

	FormCraftApp.directive('subLabel', function () {
	  return {
	    require: 'ngModel',
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      $scope.$watch($attrs.ngModel, function () {
	        if (ngModelCtrl.$modelValue === '') {
	          $scope.element.elementDefaults.has_sub_label = false;
	        } else {
	          $scope.element.elementDefaults.has_sub_label = true;
	        }
	      });
	    }

	  };
	});

	FormCraftApp.directive('fcPlaceholder', function () {
	  return {
	    require: 'ngModel',
	    link: function link($scope, $element, $attrs) {
	      $scope.$watch($attrs.ngModel, function () {
	        if ($scope.$parent.Builder.label_style === 'placeholder') {
	          $scope.element.elementDefaults.main_label_placeholder = $scope.element.elementDefaults.main_label;
	        } else {
	          $scope.element.elementDefaults.main_label_placeholder = '';
	        }
	      });
	    }
	  };
	});

	FormCraftApp.directive('fcPlaceholderUpdate', function () {
	  return {
	    require: 'ngModel',
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      $scope.$watch($attrs.ngModel, function () {
	        if (typeof ngModelCtrl.$viewValue !== 'undefined') {
	          if (ngModelCtrl.$viewValue === 'placeholder') {
	            for (var x in $scope.Builder.FormElements) {
	              for (var _y3 in $scope.Builder.FormElements[x]) {
	                if (_typeof($scope.Builder.FormElements[x][_y3]) === 'object') {
	                  var temp = $scope.Builder.FormElements[x][_y3].elementDefaults.main_label;
	                  $scope.Builder.FormElements[x][_y3].elementDefaults.main_label_placeholder = temp;
	                }
	              }
	            }
	          } else {
	            for (var _x2 in $scope.Builder.FormElements) {
	              for (var _y4 in $scope.Builder.FormElements[_x2]) {
	                if (_typeof($scope.Builder.FormElements[_x2][_y4]) === 'object') {
	                  if (typeof $scope.Builder.FormElements[_x2][_y4].elementDefaults.maskPlaceholder !== 'undefined' && $scope.Builder.FormElements[_x2][_y4].elementDefaults.maskPlaceholder.trim() !== '') {
	                    $scope.Builder.FormElements[_x2][_y4].elementDefaults.main_label_placeholder = $scope.Builder.FormElements[_x2][_y4].elementDefaults.maskPlaceholder;
	                  } else {
	                    // $scope.Builder.FormElements[x][y].elementDefaults.main_label_placeholder = '';
	                  }
	                }
	              }
	            }
	          }
	        }
	      });
	    }
	  };
	});

	FormCraftApp.directive('autosize', function () {
	  return {
	    link: function link($scope, $element) {
	      autosize($element);
	    }
	  };
	});

	FormCraftApp.directive('angularColor', function () {
	  return {
	    require: 'ngModel',
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      $element.wpColorPicker({
	        width: 237,
	        change: function change(event, ui) {
	          if (ui.color.toString() !== jQuery(this).val()) {
	            jQuery(this).val(ui.color.toString()).trigger('change');
	          }
	        },
	        clear: function clear() {
	          ngModelCtrl.$setViewValue('');
	        }
	      });
	    }
	  };
	});

	FormCraftApp.directive('tooltip', function () {
	  return {
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      $element.tooltip({ html: true });
	      $attrs.$observe('title', function innerObserveFunction() {
	        $element.tooltip('destroy');
	        if ($attrs.title.trim() !== '' && $attrs.title.indexOf('{{') === -1) {
	          $element.tooltip({ html: true });
	        } else {
	          $element.attr('data-original-title', '');
	        }
	      });
	    }

	  };
	});

	FormCraftApp.directive('inputMask', function () {
	  return {
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      $attrs.$observe('inputMask', function innerObserveFunction() {
	        if ($attrs.inputMask.trim() === '') {
	          $element.unmask();
	        } else {
	          $element.mask($attrs.inputMask.replace(/[^a-zA-Z0-9():\-\/]+/g, ''));
	        }
	      });
	    }

	  };
	});

	FormCraftApp.directive('maskPlaceholder', function () {
	  return {
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      $attrs.$observe('maskPlaceholder', function innerObserveFunction() {
	        if ($scope.$parent.Builder.label_style !== 'placeholder') {
	          $scope.element.elementDefaults.main_label_placeholder = $scope.element.elementDefaults.maskPlaceholder;
	          setTimeout(function () {
	            $element.trigger('input');
	          }, 200);
	        }
	      });
	    }

	  };
	});

	FormCraftApp.directive('slider', function () {
	  return {
	    restrict: 'A',
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      var options = {};
	      options.range = 'min';
	      options.create = function () {
	        if (options.range === true) {
	          jQuery(this).find('.ui-slider-range').eq(0).append('<span class="ui-slider-handle-nos">0</span>');
	        } else {
	          jQuery(this).find('span.ui-slider-handle').eq(0).append('<span class="ui-slider-handle-nos">0</span>');
	        }
	      };
	      options.change = options.slide = function (event, ui) {
	        var value = void 0;
	        jQuery(this).find('.ui-slider-handle-nos').css('margin-left', '-' + (jQuery(this).find('.ui-slider-handle-nos').outerWidth() / 2 - 9) + 'px');
	        if (ui.values) {
	          ui.values[0] = typeof jQuery(this).attr('data-prefix') !== 'undefined' ? jQuery(this).attr('data-prefix') + ui.values[0] : ui.values[0];
	          ui.values[0] = typeof jQuery(this).attr('data-suffix') !== 'undefined' ? ui.values[0] + jQuery(this).attr('data-suffix') : ui.values[0];
	          ui.values[1] = typeof jQuery(this).attr('data-prefix') !== 'undefined' ? jQuery(this).attr('data-prefix') + ui.values[1] : ui.values[1];
	          ui.values[1] = typeof jQuery(this).attr('data-suffix') !== 'undefined' ? ui.values[1] + jQuery(this).attr('data-suffix') : ui.values[1];
	          value = ui.values[0] + ' - ' + ui.values[1];
	        } else {
	          value = ui.value;
	          value = typeof jQuery(this).attr('data-prefix') !== 'undefined' ? jQuery(this).attr('data-prefix') + value : value;
	          value = typeof jQuery(this).attr('data-suffix') !== 'undefined' ? value + jQuery(this).attr('data-suffix') : value;
	        }
	        jQuery(this).find('.ui-slider-handle-nos').text(value);
	        jQuery(this).parent().parent().find('input').val(value).trigger('change');
	      };

	      $element.slider(options);
	      $attrs.$observe('rangeMin', function innerObserveFunction() {
	        $element.slider('option', 'min', parseFloat($attrs.rangeMin));
	      });
	      $attrs.$observe('rangeStep', function innerObserveFunction() {
	        $element.slider('option', 'step', parseFloat($attrs.rangeStep));
	      });
	      $attrs.$observe('rangeMax', function innerObserveFunction() {
	        $element.slider('option', 'max', parseFloat($attrs.rangeMax));
	      });
	      $attrs.$observe('rangeTrue', function innerObserveFunction() {
	        var range = $attrs.rangeTrue === 'true' ? true : 'min';
	        $element.slider('option', 'range', range);
	      });
	    }

	  };
	});

	FormCraftApp.directive('datepicker', function () {
	  return {
	    restrict: 'A',
	    require: 'ngModel',
	    link: function link($scope, $element, $attrs, ngModelCtrl) {
	      var options = {};
	      options.nextText = '❯';
	      options.prevText = '❮';
	      options.hideIfNoPrevNext = true;
	      options.changeYear = true;
	      options.changeMonth = true;
	      options.showAnim = false;
	      options.yearRange = 'c-20:c+20';
	      if (typeof $attrs.dateFormat !== 'undefined' && typeof $attrs.defaultDate !== 'undefined' && $attrs.defaultDate !== '' && $attrs.dateFormat !== '') {
	        if (parseInt($attrs.defaultDate, 10) !== $attrs.defaultDate) {
	          options.dateFormat = $attrs.dateFormat;
	          options.defaultDate = $attrs.defaultDate;
	        }
	      }
	      options.beforeShow = function () {
	        jQuery('#ui-datepicker-div').removeClass('ui-datepicker').addClass('fc-datepicker');
	      };
	      options.onSelect = function (input) {
	        jQuery(this).trigger('change').trigger('input');
	        $scope.$apply(function () {
	          ngModelCtrl.$setViewValue(input);
	        });
	      };
	      $element.datepicker(options);
	      $attrs.$observe('defaultDate', function innerObserveFunction() {
	        if ($element.val() !== '' && typeof $element.attr('hasLoaded') === 'undefined') {
	          (function () {
	            var temp = $attrs.defaultDate;
	            setTimeout(function () {
	              $element.val(temp).trigger('change');
	              $element.attr('hasLoaded', 'true');
	            }, 500);
	          })();
	        }
	      });
	      $scope.$watch($attrs.ngModel, function () {
	        var date = jQuery.datepicker.formatDate('yy/mm/dd', $element.datepicker('getDate'));
	        if ($attrs.ngModel === 'element.elementDefaults.minDate') {
	          $scope.element.elementDefaults.minDateAlt = date;
	        }
	        if ($attrs.ngModel === 'element.elementDefaults.maxDate') {
	          $scope.element.elementDefaults.maxDateAlt = date;
	        }
	      });
	      $attrs.$observe('dateFormat', function innerObserveFunction() {
	        if ($attrs.defaultDate === '' || $attrs.defaultDate === null) {
	          $element.datepicker('option', 'dateFormat', $attrs.dateFormat);
	          $element.trigger('change');
	        }
	      });
	      $attrs.$observe('dateLang', function innerObserveFunction() {
	        if ($attrs.dateLang !== 'en') {
	          $element.datepicker('option', 'dateFormat', $attrs.dateFormat);
	          $element.datepicker('option', 'altFormat', 'yy-mm-dd');
	          jQuery.get(FC.datepickerLang + 'datepicker-' + $attrs.dateLang + '.js');
	        }
	      });
	      $attrs.$observe('dateMin', function innerObserveFunction() {
	        if ($attrs.dateMin !== '' && parseInt($attrs.dateMin, 10) === $attrs.dateMin) {
	          var someDate = new Date();
	          someDate.setDate(someDate.getDate() + parseInt($attrs.dateMin, 10));
	          $element.datepicker('option', 'minDate', $attrs.dateMin);
	        } else {
	          $element.datepicker('option', 'dateFormat', $attrs.dateFormat);
	          $element.datepicker('option', 'altFormat', 'yy-mm-dd');
	          $element.datepicker('option', 'minDate', $attrs.dateMin);
	        }
	      });
	      $attrs.$observe('dateDays', function innerObserveFunction() {
	        var temp = jQuery.parseJSON($attrs.dateDays);
	        var tempNew = [];
	        for (var x in temp) {
	          if (temp[x] === true) {
	            tempNew.push(x);
	          }
	        }
	        $element.datepicker('option', 'beforeShowDay', function (date) {
	          if (tempNew.indexOf(date.getDay().toString()) !== -1) {
	            return [true, ''];
	          }
	          return [false, ''];
	        });
	      });
	      $attrs.$observe('dateMax', function innerObserveFunction() {
	        if ($attrs.dateMax !== '' && parseInt($attrs.dateMax, 10) === $attrs.dateMax) {
	          var someDate = new Date();
	          someDate.setDate(someDate.getDate() + parseInt($attrs.dateMax, 10));
	          $element.datepicker('option', 'maxDate', $attrs.dateMax);
	        } else {
	          $element.datepicker('option', 'dateFormat', $attrs.dateFormat);
	          $element.datepicker('option', 'altFormat', 'yy-mm-dd');
	          $element.datepicker('option', 'maxDate', $attrs.dateMax);
	        }
	      });
	    }
	  };
	});

	FormCraftApp.controller('FormController', function ($scope, $locale, $http, $timeout) {

	  $scope.addField = {};
	  $scope.addField.payments = [];
	  $scope.addField.defaults = [];
	  $scope.addField.others = [];

	  function createOptions() {
	    var options = {
	      connectWith: '.form-page-content',
	      helper: '',
	      start: function start(event, ui) {
	        ui.placeholder.html(ui.item[0].innerHTML);
	      }
	    };
	    return options;
	  }

	  $scope.testEmail = function () {
	    $scope.TestEmailResult = '<div class="fc-spinner small" style="display:block"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
	    var postData = {};
	    postData.emails = $scope.Builder.TestEmails;
	    postData.config = $scope.Builder.Config.notifications;
	    $http.post(FC.ajaxurl2 + 'action=formcraft3_test_email', postData).success(function (data) {
	      $scope.TestEmailResult = data;
	    }).error(function () {
	      $scope.TestEmailResult = 'Error';
	    });
	  };

	  $scope.FormElements = function () {
	    $http.get(FC.ajaxurl2 + 'action=formcraft3_load_form_data&type=builder&id=' + jQuery('#form_id').val()).success(function (response) {

	      /* Fetch and Fix Addons */
	      if (response.addons === null || response.addons.trim() === '') {
	        $scope.Addons = {};
	      } else {
	        if (response.addons === '[]') {
	          response.addons = '{}';
	        }
	        $scope.Addons = jQuery.evalJSON(decodeURIComponent(response.addons));
	      }

	      /* Fetch and Fix Builder */
	      if (response.builder.trim() === '') {
	        $scope.Builder = {};
	        $scope.Builder.Config = {};
	        $scope.Builder.Config.Logic = [];
	        $scope.Builder.Config.messages = {};
	        $scope.Builder.Config.autoresponder = {};
	        $scope.Builder.Config.notifications = {};
	        $scope.Builder.FormElements = [];
	        $scope.Builder.FormElements[0] = [];
	        $scope.Builder.Config.page_names = [];
	        $scope.Builder.Config.page_names[0] = 'Step 1';
	        $scope.Builder.Options = {};
	        $scope.Builder.form_background = 'white';
	        $scope.Builder.Config.color_scheme_button = '#48e';
	        $scope.Builder.Config.color_scheme_step = '#48e';
	        $scope.Builder.Config.color_scheme_font = '#fff';
	      } else if (response.builder.indexOf('[BREAK]') !== -1) {
	        $scope.Builder = {};
	        $scope.Builder.Config = {};
	        $scope.Builder.Config.Logic = [];
	        $scope.Builder.Config.messages = {};
	        $scope.Builder.Config.autoresponder = {};
	        $scope.Builder.Config.notifications = {};
	        $scope.Builder.FormElements = [];
	        $scope.Builder.FormElements[0] = [];
	        $scope.Builder.Config.page_names = [];
	        $scope.Builder.Config.page_names[0] = 'Step 1';
	        $scope.Builder.Options = {};
	        $scope.Builder.form_background = 'white';
	        $scope.Builder.Config.color_scheme_button = '#48e';
	        $scope.Builder.Config.color_scheme_step = '#48e';
	        $scope.Builder.Config.color_scheme_font = '#fff';
	        $scope.Addons = {};
	        $scope.Options = {};
	        var imported = response.builder.split('[BREAK]');
	        var build = imported[0];
	        var options = imported[1];
	        options = jQuery.evalJSON(inflate(decodeURIComponent(options.trim())));
	        var con = imported[2].replace(/\\(.?)/g, function (s, n1) {
	          switch (n1) {
	            case '\\':
	              return '\\';
	            case '0':
	              return '\u0000';
	            case '':
	              return '';
	            default:
	              return n1;
	          }
	        });
	        con = jQuery.evalJSON(con);
	        var recipients = imported[3].replace(/\\(.?)/g, function (s, n1) {
	          switch (n1) {
	            case '\\':
	              return '\\';
	            case '0':
	              return '\u0000';
	            case '':
	              return '';
	            default:
	              return n1;
	          }
	        }).replace(/"/g, '');
	        $scope.Builder.Config.notifications.recipients = recipients;
	        $scope.Builder.Config.Messages = $scope.Builder.Config.Messages || {};
	        build = jQuery.evalJSON(inflate(decodeURIComponent(build.trim())));

	        if (typeof con[0].user_save_form !== 'undefined' && con[0].user_save_form === 'save_form') {
	          $scope.Builder.Config.save_progress = true;
	        }
	        if (typeof con[0].frame !== 'undefined' && con[0].frame === 'noframe') {
	          $scope.Builder.form_frame = 'hidden';
	        }
	        if (typeof con[0].bg_image !== 'undefined' && con[0].bg_image !== '') {
	          $scope.Builder.form_background_custom_image = con[0].bg_image;
	        }
	        if (typeof con[0].number_spin !== 'undefined' && con[0].number_spin === 'spin') {
	          $scope.Builder.Config.spin_effect = true;
	        }
	        if (typeof con[0].allow_multi !== 'undefined' && con[0].allow_multi === 'no_allow_multi') {
	          $scope.Builder.Config.disable_multiple = true;
	        }
	        if (typeof con[0].placeholder !== 'undefined' && con[0].placeholder === 'placeholder') {
	          $scope.Builder.label_style = 'placeholder';
	        }
	        if (typeof con[0].multi_error !== 'undefined') {
	          $scope.Builder.Config.disable_multiple_message = con[0].multi_error;
	        }

	        if (typeof con[0].error_gen !== 'undefined') {
	          $scope.Builder.Config.Messages.failed = con[0].error_gen;
	        }
	        if (typeof con[0].success_msg !== 'undefined') {
	          $scope.Builder.Config.Messages.success = con[0].success_msg;
	        }
	        if (typeof con[0].error_email !== 'undefined') {
	          $scope.Builder.Config.Messages.allow_email = con[0].error_email;
	        }
	        if (typeof con[0].error_only_integers !== 'undefined') {
	          $scope.Builder.Config.Messages.allow_numbers = con[0].error_only_integers;
	        }
	        if (typeof con[0].error_only_alpha !== 'undefined') {
	          $scope.Builder.Config.Messages.allow_alphabets = con[0].error_only_alpha;
	        }
	        if (typeof con[0].error_only_alnum !== 'undefined') {
	          $scope.Builder.Config.Messages.allow_alphanumeric = con[0].error_only_alnum;
	        }
	        if (typeof con[0].error_required !== 'undefined') {
	          $scope.Builder.Config.Messages.is_required = con[0].error_required;
	        }
	        if (typeof con[0].error_min !== 'undefined') {
	          con[0].error_min = con[0].error_min.replace('[min_chars]', '[x]');
	          $scope.Builder.Config.Messages.min_char = con[0].error_min;
	        }
	        if (typeof con[0].error_max !== 'undefined') {
	          con[0].error_max = con[0].error_max.replace('[max_chars]', '[x]');
	          $scope.Builder.Config.Messages.max_char = con[0].error_max;
	        }

	        if (typeof con[0].autoreply_s !== 'undefined') {
	          $scope.Builder.Config.autoresponder.email_subject = con[0].autoreply_s;
	        }
	        if (typeof con[0].email_sub !== 'undefined') {
	          $scope.Builder.Config.notifications.email_subject = con[0].email_sub;
	        }
	        if (typeof con[0].mail_type !== 'undefined' && con[0].mail_type === 'smtp') {
	          $scope.Builder.Config.notifications._method = 'smtp';
	        }

	        if (typeof con[0].from_name !== 'undefined') {
	          $scope.Builder.Config.notifications.general_sender_name = con[0].from_name;
	        }
	        if (typeof con[0].smtp_username !== 'undefined') {
	          $scope.Builder.Config.notifications.smtp_sender_username = con[0].smtp_username;
	        }
	        if (typeof con[0].smtp_pass !== 'undefined') {
	          $scope.Builder.Config.notifications.smtp_sender_password = con[0].smtp_pass;
	        }
	        if (typeof con[0].smtp_host !== 'undefined') {
	          $scope.Builder.Config.notifications.smtp_sender_host = con[0].smtp_host;
	        }
	        if (typeof con[0].smtp_port !== 'undefined') {
	          $scope.Builder.Config.notifications.smtp_sender_port = con[0].smtp_port;
	        }
	        if (typeof con[0].email_body !== 'undefined') {
	          con[0].email_body = con[0].email_body.replace(/\n/g, '<br>');
	          $scope.Builder.Config.notifications.email_body = con[0].email_body;
	        }
	        if (typeof con[0].if_ssl !== 'undefined' && con[0].if_ssl === 'ssl') {
	          $scope.Builder.Config.notifications.smtp_sender_security = 'ssl';
	        }
	        if (typeof con[0].if_ssl !== 'undefined' && con[0].if_ssl === 'tls') {
	          $scope.Builder.Config.notifications.smtp_sender_security = 'tls';
	        }

	        if (typeof con[0].autoreply_name !== 'undefined') {
	          $scope.Builder.Config.autoresponder.email_sender_name = con[0].autoreply_name;
	        }
	        if (typeof con[0].autoreply_email !== 'undefined') {
	          $scope.Builder.Config.autoresponder.email_sender_email = con[0].autoreply_email;
	        }
	        if (typeof con[0].autoreply_s !== 'undefined') {
	          $scope.Builder.Config.autoresponder.email_subject = con[0].autoreply_s;
	        }
	        if (typeof con[0].autoreply_s !== 'undefined') {
	          con[0].autoreply = con[0].autoreply.replace(/\n/g, '<br>');
	          $scope.Builder.Config.autoresponder.email_body = con[0].autoreply;
	        }

	        if (typeof con[0].from_email !== 'undefined') {
	          $scope.Builder.Config.notifications.general_sender_email = con[0].from_email;
	        }
	        if (typeof con[0].placeholder !== 'undefined' && con[0].placeholder === 'placeholder') {
	          $scope.Builder.label_style = 'placeholder';
	        }
	        if (typeof con[0].block_label !== 'undefined' && con[0].block_label === 'block_label') {
	          $scope.Builder.label_style = 'block';
	        }
	        if (typeof con[0].allow_multi !== 'undefined' && con[0].allow_multi === 'allow_multi') {
	          $scope.Builder.Config.disable_multiple = true;
	        }
	        if (typeof con[0].multi_error !== 'undefined') {
	          $scope.Builder.Config.disable_multiple_message = con[0].multi_error;
	        }
	        if (typeof con[0].fw !== 'undefined') {
	          $scope.Builder.form_width = con[0].fw;
	        }
	        if (typeof con[0].bg_image !== 'undefined') {
	          $scope.Builder.form_background_custom_image = con[0].bg_image.replace('url(', '').replace(')', '');
	        }

	        if (typeof con[0].form_title !== 'undefined' && con[0].form_title !== '') {
	          $scope.addFormElement('heading');
	          $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_value'] = con[0].form_title;
	          $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['headingSize'] = 1.8;
	          $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['headingWeight'] = true;
	          if (typeof con[0].ftalign !== 'undefined') {
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['headingAlignment'] = con[0].ftalign;
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['paddingTop'] = '15px';
	          }
	        }

	        var x = 0;
	        while (x < build.length - 1) {
	          x++;
	          if (build[x].el_b.indexOf('One-line Text Input') !== -1) {
	            $scope.addFormElement('oneLineText');
	          } else if (build[x].el_b.indexOf('Hidden Field') !== -1) {
	            $scope.addFormElement('customText');
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['html'] = '';
	            if (typeof build[x].hidval !== 'undefined') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_value'] = build[x].hidval;
	            }
	          } else if (build[x].el_b.indexOf('Divider') !== -1) {
	            $scope.addFormElement('heading');
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_value'] = build[x].cap1;
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['headingSize'] = 1.5;
	          } else if (build[x].el_b.indexOf('Email Input') !== -1) {
	            $scope.addFormElement('email');
	            if (typeof build[x].autoreply !== 'undefined' && build[x].autoreply === 'autoreply') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['autoresponder'] = true;
	            }
	            if (typeof build[x].replyto !== 'undefined' && build[x].replyto === 'replyto') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['replyTo'] = true;
	            }
	          } else if (build[x].el_b.indexOf('Paragraph Text Input') !== -1) {
	            $scope.addFormElement('textarea');
	          } else if (build[x].el_b.indexOf('Custom Text') !== -1) {
	            $scope.addFormElement('customText');
	            if (typeof build[x].customText !== 'undefined') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['html'] = build[x].customText;
	            }
	            if (typeof build[x].hValue !== 'undefined') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_value'] = build[x].hValue;
	            }
	          } else if (build[x].el_b.indexOf('Image') !== -1) {
	            $scope.addFormElement('customText');
	            if (typeof build[x].image !== 'undefined') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['html'] = '<img src=\'' + build[x].image + '\'/>';
	            }
	          } else if (build[x].el_b.indexOf('TimePicker') !== -1) {
	            $scope.addFormElement('timepicker');
	          } else if (build[x].el_b.indexOf('DatePicker') !== -1) {
	            $scope.addFormElement('datepicker');
	          } else if (build[x].el_b.indexOf('Slider Group') !== -1) {
	            $scope.addFormElement('slider');
	            if (typeof build[x].min !== 'undefined') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['range_min'] = build[x].min;
	            }
	            if (typeof build[x].max !== 'undefined') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['range_max'] = build[x].max;
	            }
	          } else if (build[x].el_b.indexOf('Slider Range Group') !== -1) {
	            $scope.addFormElement('slider');
	            if (typeof build[x].min !== 'undefined') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['range_min'] = build[x].min;
	            }
	            if (typeof build[x].max !== 'undefined') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['range_max'] = build[x].max;
	            }
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['range_true'] = true;
	          } else if (build[x].el_b.indexOf('Submit Button') !== -1) {
	            $scope.addFormElement('submit');
	          } else if (build[x].el_b.indexOf('File Upload') !== -1) {
	            $scope.addFormElement('fileupload');
	            if (typeof build[x].file_type !== 'undefined') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['allow_extensions'] = build[x].file_type.replace(/ /g, ', ');
	            }
	          } else if (build[x].el_b.indexOf('Choice Matrix') !== -1) {
	            $scope.addFormElement('matrix');
	            var temp = [];
	            if (typeof build[x].matrix1 !== 'undefined') {
	              temp.push(build[x].matrix1);
	            }
	            if (typeof build[x].matrix2 !== 'undefined') {
	              temp.push(build[x].matrix2);
	            }
	            if (typeof build[x].matrix3 !== 'undefined') {
	              temp.push(build[x].matrix3);
	            }
	            if (typeof build[x].matrix4 !== 'undefined') {
	              temp.push(build[x].matrix4);
	            }
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['options_list'] = temp.join('\n');
	            temp = build[x].el_f.split('opt in option[');
	            var temp2 = temp[1].split(']');
	            var temp3 = [];
	            if (typeof options[temp2[0]] !== 'undefined') {
	              for (y in options[temp2[0]].Drop) {
	                temp3.push(options[temp2[0]].Drop[y].val);
	              }
	            }
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['matrix_rows'] = temp3.join('\n');
	          } else if (build[x].el_b.indexOf('Star Rating') !== -1 || build[x].el_b.indexOf('Smiley Rating') !== -1) {
	            $scope.addFormElement('star');
	            var _temp = build[x].el_f.split('opt in option[');
	            var _temp2 = _temp[1].split(']');
	            var _temp3 = [];
	            if (typeof options[_temp2[0]] !== 'undefined') {
	              for (y in options[_temp2[0]].Drop) {
	                _temp3.push(options[_temp2[0]].Drop[y].val);
	              }
	            }
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['options_list'] = _temp3.join('\n');
	          } else if (build[x].el_b.indexOf('Radio Group') !== -1) {
	            $scope.addFormElement('checkbox');
	          } else if (build[x].el_b.indexOf('Dropdown Box') !== -1) {
	            $scope.addFormElement('dropdown');
	          } else if (build[x].el_b.indexOf('CheckBox Group') !== -1) {
	            $scope.addFormElement('checkbox');
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['allow_multiple'] = 'checkbox';
	          }

	          if (typeof build[x].inst !== 'undefined') {
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['instructions'] = build[x].inst;
	          }
	          if (typeof build[x].cap1 !== 'undefined') {
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['main_label'] = build[x].cap1;
	          }
	          if (typeof build[x].options_raw !== 'undefined') {
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['options_list'] = build[x].options_raw;
	          }
	          if (typeof build[x].uploadtext !== 'undefined') {
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['button_label'] = build[x].uploadtext;
	          }
	          if (typeof build[x].cap2 !== 'undefined') {
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['sub_label'] = build[x].cap2;
	          }
	          if (typeof build[x].req !== 'undefined' && build[x].req === 1) {
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['sub_label'] = true;
	          }
	          if (typeof build[x].default !== 'undefined' && build[x].default === 'is_hidden') {
	            $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['hidden_default'] = true;
	          }
	          if (typeof build[x].inline !== 'undefined') {
	            if (build[x].inline === 'inline4') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_width'] = '25%';
	            }
	            if (build[x].inline === 'inline3') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_width'] = '33.3%';
	            }
	            if (build[x].inline === 'inline2') {
	              $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_width'] = '50%';
	            }
	          }
	          $scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['show_options'] = false;
	        }
	      } else {
	        var raw_builder = inflate(decodeURIComponent(response.builder.trim()));
	        if (response.old_url !== false) {
	          var reg = new RegExp(response.old_url, 'g');
	          raw_builder = raw_builder.replace(reg, response.new_url);
	        }
	        raw_builder = jQuery.evalJSON(raw_builder);
	        if (typeof raw_builder.FormElements[0].element === 'undefined') {
	          for (var _x3 in raw_builder.FormElements[0]) {
	            raw_builder.FormElements[0][_x3].identifier = raw_builder.FormElements[0][_x3].identifier || 'field' + _x3;
	          }
	        } else {
	          for (var _x4 in raw_builder.FormElements) {
	            raw_builder.FormElements[_x4].identifier = raw_builder.FormElements[_x4].identifier || 'field' + _x4;
	          }
	        }

	        $scope.Builder = raw_builder;
	      }

	      /* Fetch and Fix Meta Data */
	      if (response.meta_builder !== null && response.meta_builder !== '') {
	        var raw_meta = response.meta_builder;
	        if (response.old_url !== false) {
	          var _reg = new RegExp(response.old_url, 'g');
	          raw_meta = raw_meta.replace(_reg, response.new_url);
	        }
	        $scope.Builder.Config = jQuery.evalJSON(raw_meta);
	      }

	      $scope.Options = {};
	      $scope.Builder.Config = $scope.Builder.Config || {};
	      $scope.Builder.Config.page_names = $scope.Builder.Config.page_names || [];
	      if (response.name) {
	        $scope.Builder.Config.form_name = response.name;
	      }
	      $scope.Builder.Config.autoresponder = $scope.Builder.Config.autoresponder || {};
	      $scope.Builder.Config.Messages = $scope.Builder.Config.Messages || {};
	      $scope.Builder.Config.notifications = $scope.Builder.Config.notifications || {};

	      if (typeof $scope.Builder.FormElements[0].element !== 'undefined') {
	        var _temp4 = $scope.Builder.FormElements;
	        $scope.Builder.FormElements = [];
	        $scope.Builder.FormElements[0] = _temp4;
	      }

	      $scope.Options.showOptions = false;
	      $scope.Options.showAddons = false;
	      $scope.Options.showStyling = false;
	      $scope.Options.showLogic = false;

	      $scope.Builder.Config.decimal_separator = $scope.Builder.Config.decimal_separator === undefined ? '.' : $scope.Builder.Config.decimal_separator;
	      $scope.Builder.Config.thousand_separator = $scope.Builder.Config.thousand_separator === undefined ? '' : $scope.Builder.Config.thousand_separator;

	      $scope.Builder.label_style = $scope.Builder.label_style === undefined ? 'inline' : $scope.Builder.label_style;
	      $scope.Builder.form_width = $scope.Builder.form_width === undefined ? '420px' : $scope.Builder.form_width;
	      if ($scope.Builder.form_width.match(/^[0-9]+$/) !== null) {
	        $scope.Builder.form_width = $scope.Builder.form_width + 'px';
	      }
	      $scope.Builder.form_frame = $scope.Builder.form_frame === undefined ? 'visible' : $scope.Builder.form_frame;
	      $scope.Builder.font_size = $scope.Builder.font_size === undefined ? 100 : $scope.Builder.font_size;
	      $scope.Builder.Config.font_color = $scope.Builder.Config.font_color === undefined ? '#666666' : $scope.Builder.Config.font_color;
	      $scope.Builder.Config.field_font_color = $scope.Builder.Config.field_font_color || '#777';

	      $scope.Builder.Config.webhook_method = $scope.Builder.Config.webhook_method || 'POST';

	      $scope.Builder.nextText = $scope.Builder.nextText === undefined ? 'Next' : $scope.Builder.nextText;
	      $scope.Builder.prevText = $scope.Builder.prevText === undefined ? 'Previous' : $scope.Builder.prevText;

	      $scope.Builder.Config.font_family = $scope.Builder.Config.font_family === undefined ? 'inherit' : $scope.Builder.Config.font_family;
	      $scope.Builder.form_internal_alignment = $scope.Builder.form_internal_alignment === undefined ? 'left' : $scope.Builder.form_internal_alignment;

	      $scope.Builder.Config.Messages.is_required = $scope.Builder.Config.Messages.is_required || 'Required';
	      $scope.Builder.Config.Messages.is_invalid = $scope.Builder.Config.Messages.is_invalid || 'Invalid';
	      $scope.Builder.Config.Messages.min_char = $scope.Builder.Config.Messages.min_char || 'Min [x] characters required';
	      $scope.Builder.Config.Messages.max_char = $scope.Builder.Config.Messages.max_char || 'Max [x] characters allowed';
	      $scope.Builder.Config.Messages.min_files = $scope.Builder.Config.Messages.min_files || 'Min [x] file(s) required';
	      $scope.Builder.Config.Messages.max_files = $scope.Builder.Config.Messages.max_files || 'Max [x] file(s) allowed';
	      $scope.Builder.Config.Messages.max_file_size = $scope.Builder.Config.Messages.max_file_size || 'Files bigger than [x] MB not allowed';
	      $scope.Builder.Config.Messages.allow_email = $scope.Builder.Config.Messages.allow_email || 'Invalid Email';
	      $scope.Builder.Config.Messages.allow_url = $scope.Builder.Config.Messages.allow_url || 'Invalid URL';
	      $scope.Builder.Config.Messages.allow_regexp = $scope.Builder.Config.Messages.allow_regexp || 'Invalid Expression';
	      $scope.Builder.Config.Messages.allow_alphabets = $scope.Builder.Config.Messages.allow_alphabets || 'Only alphabets';
	      $scope.Builder.Config.Messages.allow_numbers = $scope.Builder.Config.Messages.allow_numbers || 'Only numbers';
	      $scope.Builder.Config.Messages.allow_alphanumeric = $scope.Builder.Config.Messages.allow_alphanumeric || 'Should be alphanumeric';
	      $scope.Builder.Config.Messages.failed = $scope.Builder.Config.Messages.failed || 'Please correct the errors and try again';
	      $scope.Builder.Config.Messages.success = $scope.Builder.Config.Messages.success || 'Message received';

	      $scope.Builder.Config.autoresponder.email_body = $scope.Builder.Config.autoresponder.email_body || '<p>Hello [Name],</p><p><br></p><p>We have received your submission. Here are the details you have submitted to us:</p><p>[Form Content]</p><p><br></p><p>Regards,</p><p>Nishant</p>';
	      $scope.Builder.Config.autoresponder.email_subject = $scope.Builder.Config.autoresponder.email_subject || 'Thank you for your submission';

	      $scope.Builder.Config.notifications._method = $scope.Builder.Config.notifications._method || 'php';
	      $scope.Builder.Config.notifications.form_layout = $scope.Builder.Config.notifications.form_layout || false;
	      $scope.Builder.Config.notifications.email_body = $scope.Builder.Config.notifications.email_body || '<p>Hello,</p><p><br></p><p>You have received a new form submission for the form [Form Name]. Here are the details:</p><p>[Form Content]</p><p><br></p><p>Page: [URL]<br>Unique ID: #[Entry ID]<br>Date: [Date]<br>Time: [Time]</p>';
	      $scope.Builder.Config.notifications.email_subject = $scope.Builder.Config.notifications.email_subject || '[Form Name] - New Form Submission';

	      $scope.Builder.Config.color_scheme_font = $scope.Builder.Config.color_scheme_font || '#fff';
	      $scope.Builder.Config.font_color = $scope.Builder.Config.font_color || '#666';
	      $scope.Builder.Config.field_font_color = $scope.Builder.Config.field_font_color || '#777';
	      $scope.Builder.Config.color_field_background = $scope.Builder.Config.color_field_background || '#fafafa';
	      $scope.Builder.Config.color_scheme_checkbox = $scope.Builder.Config.color_scheme_checkbox || '#4488ee';
	      $scope.Builder.Config.color_scheme_button = $scope.Builder.Config.color_scheme_button || '#4488ee';
	      $scope.Builder.Config.color_scheme_step = $scope.Builder.Config.color_scheme_step || '#4488ee';

	      var f3_activated = getURLParameter('f3_activated');
	      if (f3_activated !== null) {
	        $scope.Options.showAddons = true;
	        setTimeout(function () {
	          jQuery('.fc_highlight').slideDown();
	        }, 1500);
	        setTimeout(function () {
	          jQuery('.fc_highlight').removeClass('fc_highlight');
	        }, 3000);
	      }

	      jQuery('.form-builder-cover').removeClass('hide-form');
	      setTimeout(function () {
	        jQuery('.dropdown-cover select').trigger('change');
	      }, 300);
	      setTimeout(function () {
	        jQuery('.form-cover-builder').removeClass('hide-form-options');
	      }, 1000);

	      $scope.$watch('Builder.form_width', function (newValue, oldValue) {
	        $scope.Builder.form_width_nos = parseInt(jQuery('.fc-form').width(), 10) + 760;
	      });
	      $scope.$watch('Builder.Config.notifications.smtp_sender_host', function (newValue) {
	        if (typeof $scope.Builder.Config.notifications.smtp_sender_host !== 'undefined' && $scope.Builder.Config.notifications.smtp_sender_host.indexOf('gmail') !== -1) {
	          $scope.Builder.Config.notifications.showTip = true;
	        } else {
	          $scope.Builder.Config.notifications.showTip = false;
	        }
	      });
	      $scope.$watch('Builder.Config.font_family', function (newValue) {
	        if (typeof $scope.Builder.Config.font_family !== 'undefined' && $scope.Builder.Config.font_family.indexOf('Arial') === -1 && $scope.Builder.Config.font_family.indexOf('Courier') === -1 && $scope.Builder.Config.font_family.indexOf('sans-serif') === -1 && $scope.Builder.Config.font_family.indexOf('inherit') === -1) {
	          jQuery('head').append('<link href=\'' + (location.protocol === 'http:' ? 'http:' : 'https:') + '//fonts.googleapis.com/css?family=' + $scope.Builder.Config.font_family.replace(/ /g, '+') + ':400,600,700\' rel=\'stylesheet\' type=\'text/css\'>');
	        }
	      });
	      $scope.$watch('Color_scheme', function () {
	        if (typeof $scope.Color_scheme !== 'undefined') {
	          $scope.Builder.Config.color_scheme_font = '#fff';
	          $scope.Builder.Config.font_color = '#666';
	          $scope.Builder.Config.field_font_color = '#777';
	          $scope.Builder.Config.color_field_background = '#fafafa';
	          $scope.Builder.Config.color_scheme_checkbox = $scope.Color_scheme;
	          $scope.Builder.Config.color_scheme_button = $scope.Color_scheme;
	          $scope.Builder.Config.color_scheme_step = $scope.Color_scheme;
	        }
	        setTimeout(function () {
	          jQuery('.custom-color .wp-color-picker').trigger('change');
	        }, 100);
	      });

	      $scope.$watch('Builder.Config.color_scheme_button', function () {
	        $scope.Builder.Config.color_scheme_button_dark = shadeColor($scope.Builder.Config.color_scheme_button, -12);
	        setTimeout(function () {
	          jQuery('.custom-color .wp-color-picker').trigger('change');
	        }, 100);
	      });
	      $scope.$watch('Builder.Config.color_scheme_step', function () {
	        $scope.Builder.Config.color_scheme_step_dark = shadeColor($scope.Builder.Config.color_scheme_step, -12);
	        setTimeout(function () {
	          jQuery('.custom-color .wp-color-picker').trigger('change');
	        }, 100);
	      });

	      $scope.$watch('Builder.form_background_raw', function (newValue) {
	        if (typeof $scope.Builder.form_background_raw !== 'undefined' && $scope.Builder.form_background_raw !== '' && (typeof $scope.Builder.form_background_custom_image === 'undefined' || $scope.Builder.form_background_custom_image === '')) {
	          $scope.Builder.form_background = $scope.Builder.form_background_raw;
	        }
	      });
	      $scope.$watch('Builder.form_background_custom_image', function (newValue) {
	        if (typeof $scope.Builder.form_background_custom_image !== 'undefined' && $scope.Builder.form_background_custom_image !== '') {
	          $scope.Builder.form_background = 'url(' + $scope.Builder.form_background_custom_image + ')';
	          $scope.Builder.form_background_raw = '';
	        }
	      });

	      $scope.Pristine = $scope.Builder.FormElements;
	      var initY = 0;
	      $scope.toX = 0;
	      for (var _x5 in $scope.Builder.FormElements) {

	        $scope.$watchCollection('Builder.FormElements[\'' + _x5 + '\']', function () {
	          $scope.applyLogicFix();
	        });
	        $scope.$watchCollection('Builder.FormElements', function () {
	          $scope.sortableOptions = [];
	          for (var _x6 in $scope.Builder.FormElements) {
	            $scope.sortableOptions.push(createOptions(_x6));
	          }
	        });
	        for (var _y5 in $scope.Builder.FormElements[_x5]) {
	          $scope.$watchCollection('Builder.FormElements[' + _x5 + '][' + _y5 + '].elementDefaults.main_label', function () {
	            if ($scope.toX < initY) {
	              $scope.toX += 1;
	            }
	            if ($scope.toX === initY) {
	              $scope.updateListOfFields();
	            }
	          });
	          initY += 1;
	        }
	      }

	      var slidingPanels = ['Options.showOptions', 'Options.showStyling', 'Options.showLogic', 'Options.showAddons'];
	      $scope.$watchGroup(slidingPanels, function (newValue, oldValue) {
	        newValue.forEach(function (x, y) {
	          if (x === false && oldValue[y] === true) {
	            $scope.Options[slidingPanels[y].split('.')[1]] = 'hiding';
	            $timeout(function () {
	              $scope.Options[slidingPanels[y].split('.')[1]] = false;
	            }, 350);
	          }
	        });
	      });
	    });
	  }();

	  $scope.builderInit = function () {
	    builderInit();
	  };

	  $scope.clearCustom = function () {
	    $scope.Builder.form_background_custom_image = '';
	    jQuery('.color-schemes .color-picker').val('');
	  };

	  $scope.updateListOfFields = function () {
	    $scope.listOfFields = [];
	    var i = 0;
	    for (var a in $scope.Builder.FormElements) {
	      if (_typeof($scope.Builder.FormElements[a]) !== 'object') {
	        continue;
	      }
	      for (var b in $scope.Builder.FormElements[a]) {
	        if (_typeof($scope.Builder.FormElements[a][b]) !== 'object') {
	          continue;
	        }
	        i += 1;
	        $scope.listOfFields.push({
	          identifier: $scope.Builder.FormElements[a][b].identifier,
	          label: $scope.Builder.FormElements[a][b].elementDefaults.main_label
	        });
	      }
	    }
	    window.lastCheckedFieldsNos = i;
	    window.lastSaveFieldsNos = typeof window.lastSaveFieldsNos === 'undefined' ? i : window.lastSaveFieldsNos;
	  };
	  $scope.applyLogicFix = function () {
	    for (var x in $scope.Builder.Config.Logic) {
	      for (var _y6 in $scope.Builder.Config.Logic[x][1]) {
	        applySelectFix('cons_select_fix_' + x + '_' + _y6, $scope.Builder.Config.Logic[x][1][_y6][4]);
	      }
	      for (var _y7 in $scope.Builder.Config.Logic[x][0]) {
	        applySelectFix('select_fix_' + x + '_' + _y7, $scope.Builder.Config.Logic[x][0][_y7][0]);
	      }
	    }
	  };
	  $scope.saveForm = function (followup) {
	    if (followup === 'preview') {
	      if (typeof previewForm === 'undefined') {
	        window.previewForm = window.open(FC.baseurl + '/form-view/' + FC.form_id + '?preview=true', 'myWindow');
	      } else {
	        window.previewForm = window.open(FC.baseurl + '/form-view/' + FC.form_id + '?preview=true', 'myWindow');
	        if (previewForm.document.getElementById('form-cover') !== null) {
	          previewForm.document.getElementById('form-cover').innerHTML = '<span class="fc-spinner form-spinner small" style="display: block; margin: 150px auto"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></span>';
	        }
	      }
	      previewForm.location = FC.baseurl + '/form-view/' + FC.form_id + '?preview=true';
	    }
	    saveFormJQuery($scope.Builder, $scope.Addons, $scope.addField, function (itWorked) {
	      if (followup === 'pluginInstalled' && itWorked === true) {
	        window.location.assign(window.location.href + '&f3_activated=' + window.pluginInstalled);
	      }
	    });
	  };
	  $scope.toggleOptions = function ($parent, $index) {
	    $scope.Builder.FormElements[$parent][$index].showOptions = !$scope.Builder.FormElements[$parent][$index].showOptions;
	    var open = false;
	    for (var page in $scope.Builder.FormElements) {
	      for (var element in $scope.Builder.FormElements[page]) {
	        if ($scope.Builder.FormElements[page][element].showOptions === true) {
	          open = true;
	        }
	      }
	    }
	    if (open === true) {
	      jQuery('.fc-form').addClass('options-fade');
	    } else {
	      jQuery('.fc-form').removeClass('options-fade');
	    }
	  };
	  $scope.addLogic = function () {
	    if (typeof $scope.Builder.Config.Logic === 'undefined') {
	      $scope.Builder.Config.Logic = [];
	    }
	    $scope.Builder.Config.Logic.push([]);
	    var len = $scope.Builder.Config.Logic.length - 1;
	    $scope.Builder.Config.Logic[len][0] = [[]];
	    $scope.Builder.Config.Logic[len][1] = [[]];
	    $scope.Builder.Config.Logic[len][2] = 'and';
	  };
	  $scope.removeLogic = function ($index) {
	    $scope.Builder.Config.Logic.splice($index, 1);
	  };
	  $scope.addLogicAction = function ($index) {
	    $scope.Builder.Config.Logic[$index][0].push([]);
	  };
	  $scope.removeLogicAction = function ($parent, $index) {
	    $scope.Builder.Config.Logic[$parent][0].splice($index, 1);
	  };
	  $scope.addLogicResult = function ($index) {
	    $scope.Builder.Config.Logic[$index][1].push([]);
	  };
	  $scope.removeLogicResult = function ($parent, $index) {
	    $scope.Builder.Config.Logic[$parent][1].splice($index, 1);
	  };
	  $scope.removeFormElement = function ($parent, $index) {
	    $scope.Builder.FormElements[$parent].splice($index, 1);
	    var open = false;
	    for (var page in $scope.Builder.FormElements) {
	      for (var element in $scope.Builder.FormElements[page]) {
	        if ($scope.Builder.FormElements[page][element].showOptions === true) {
	          open = true;
	        }
	      }
	    }
	    if (open === true) {
	      jQuery('.fc-form').addClass('options-fade');
	    } else {
	      jQuery('.fc-form').removeClass('options-fade');
	    }
	    $scope.updateListOfFields();
	  };
	  $scope.duplicateFormElement = function ($parent, $index) {
	    $scope.Builder.FormElements[$parent].splice($index, 0, angular.copy($scope.Builder.FormElements[$parent][$index]));
	    var position = $index + 1;
	    $scope.Builder.elements_counter = $scope.Builder.elements_counter + 1;
	    $scope.Builder.FormElements[$parent][position].elementDefaults.identifier = 'field' + $scope.Builder.elements_counter;
	    $scope.Builder.FormElements[$parent][position].identifier = 'field' + $scope.Builder.elements_counter;
	    $scope.updateListOfFields();
	  };

	  $scope.addCountries = function ($parent, $index) {
	    $scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = __webpack_require__(1).countries;
	  };
	  $scope.addNationalities = function ($parent, $index) {
	    $scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = __webpack_require__(2).nationalities;
	  };
	  $scope.addLanguages = function ($parent, $index) {
	    $scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = __webpack_require__(3).languages;
	  };
	  $scope.addStates = function ($parent, $index) {
	    $scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = __webpack_require__(4).states;
	  };
	  $scope.addDays = function ($parent, $index) {
	    $scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = 'Sunday\nMonday\nTuesday\nWednesday\nThursday\nFriday\nSaturday';
	  };
	  $scope.addMonths = function ($parent, $index) {
	    $scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = 'January\nFebruary\nMarch\nApril\nMay\nJune\nJuly\nAugust\nSeptember\nOctober\nNovember\nDecember';
	  };
	  $scope.listIcons = __webpack_require__(5).icons;

	  $scope.dateLang = ['af', 'ar-DZ', 'ar', 'az', 'be', 'bg', 'bs', 'ca', 'cs', 'cy-GB', 'da', 'de', 'el', 'en-AU', 'en-GB', 'en-NZ', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fo', 'fr-CA', 'fr-CH', 'fr', 'gl', 'he', 'hi', 'hr', 'hu', 'hy', 'id', 'is', 'it-CH', 'it', 'ja', 'ka', 'kk', 'km', 'ko', 'ky', 'lb', 'lt', 'lv', 'mk', 'ml', 'ms', 'nb', 'nl-BE', 'nl', 'nn', 'no', 'pl', 'pt-BR', 'pt', 'rm', 'ro', 'ru', 'sk', 'sl', 'sq', 'sr-SR', 'sr', 'sv', 'ta', 'th', 'tj', 'tr', 'uk', 'vi', 'zh-CN', 'zh-HK', 'zh-TW'];

	  $scope.fieldHTMLTemplate = __webpack_require__(6).fieldHTML;
	  $scope.fieldOptionTemplate = __webpack_require__(6).fieldOptions;

	  $scope.addFormElement = function (type, position) {
	    var total = 0;
	    total = total + $scope.Builder.FormElements.length;

	    $scope.elementTemp = {};
	    $scope.elementTemp.field_width = '100%';
	    $scope.Builder.elements_counter = $scope.Builder.elements_counter === undefined ? 1 : $scope.Builder.elements_counter + 1;
	    var tempVar = $scope.Builder.elements_counter;
	    $scope.elementTemp.identifier = 'field' + parseInt(tempVar, 10);
	    $scope.elementTemp.hidden_default = false;
	    $scope.elementTemp.required = false;
	    $scope.restrict = false;

	    switch (type) {
	      case 'heading':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Heading';
	        $scope.elementTemp.field_value = 'Some Title';
	        $scope.elementTemp.headingSize = 1.5;
	        $scope.elementTemp.headingAlignment = 'left';
	        break;

	      case 'oneLineText':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Name';
	        $scope.elementTemp.sub_label = 'your full name';
	        $scope.elementTemp.selectedIcon = 'no-icon';
	        break;

	      case 'password':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Password';
	        $scope.elementTemp.sub_label = 'check your caps';
	        break;

	      case 'email':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate.email\'></div>';
	        $scope.elementTemp.main_label = 'Email';
	        $scope.elementTemp.sub_label = 'a valid email';
	        break;

	      case 'textarea':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Comments';
	        $scope.elementTemp.sub_label = 'more details';
	        $scope.elementTemp.field_height = '5';
	        break;

	      case 'checkbox':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Favorite Fruits';
	        $scope.elementTemp.sub_label = 'pick one!';
	        $scope.elementTemp.allow_multiple = 'checkbox';
	        $scope.elementTemp.options_list = 'Apple\nOrange\nWatermelon';
	        break;

	      case 'dropdown':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Language';
	        $scope.elementTemp.sub_label = 'pick one!';
	        $scope.elementTemp.options_list = '==Select An Option\nEnglish\nFrench\nSpanish';
	        break;

	      case 'datepicker':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Date';
	        $scope.elementTemp.sub_label = 'of appointment';
	        $scope.elementTemp.dateLang = 'en';
	        $scope.elementTemp.dateFormat = 'dd/mm/yy';
	        $scope.elementTemp.dateDays = { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true };
	        break;

	      case 'customText':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.html = 'Add some text or <strong>HTML</strong> here';
	        $scope.elementTemp.main_label = 'Text Field';
	        $scope.elementTemp.font_color = '#666666';
	        $scope.elementTemp.floating_type = 'false';
	        $scope.elementTemp.alignment = 'left';
	        break;

	      case 'submit':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Submit Form';
	        $scope.elementTemp.isWide = false;
	        $scope.elementTemp.doAnimate = false;
	        $scope.elementTemp.alignment = 'right';
	        break;

	      case 'fileupload':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'File';
	        $scope.elementTemp.sub_label = 'upload';
	        $scope.elementTemp.button_label = 'Upload';
	        break;

	      case 'slider':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Slider';
	        $scope.elementTemp.sub_label = 'take your pick';
	        $scope.elementTemp.range_true = 'min';
	        $scope.elementTemp.range_step = 5;
	        $scope.elementTemp.range_min = 10;
	        $scope.elementTemp.range_max = 100;
	        $scope.elementTemp.scale_true = false;
	        break;

	      case 'timepicker':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Time';
	        $scope.elementTemp.sub_label = 'of appointment';
	        $scope.elementTemp.format_24 = false;
	        $scope.elementTemp.hrs_min = 0;
	        $scope.elementTemp.hrs_max = 24;
	        $scope.elementTemp.hrs_step = 2;
	        break;

	      case 'star':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Rate';
	        $scope.elementTemp.sub_label = 'our support';
	        $scope.elementTemp.options_list = '1==Bad\n2==Could be better\n3==So so\n4==Good\n5==Excellent!';
	        break;

	      case 'thumb':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Liked the food?';
	        $scope.elementTemp.sub_label = 'let us know';
	        $scope.elementTemp.options_list = '1==Yep\n0==Nope';
	        break;

	      case 'matrix':
	        $scope.element = '<div compile=\'fieldHTMLTemplate["' + type + '"]\'></div>';
	        $scope.elementOptions = '<div compile=\'fieldOptionTemplate["' + type + '"]\'></div>';
	        $scope.elementTemp.main_label = 'Survey';
	        $scope.elementTemp.sub_label = '';
	        $scope.elementTemp.matrix_rows = 'How Was the Food?\nHow Was the Service?';
	        $scope.elementTemp.matrix_cols = 'Poor\nAverage\nGood';
	        break;

	      default:
	        for (var x in $scope.addField.payments) {
	          if ($scope.addField.payments[x].name === type) {
	            for (var _y8 in $scope.Builder.FormElements) {
	              for (var z in $scope.Builder.FormElements[_y8]) {
	                if ($scope.Builder.FormElements[_y8][z].type === $scope.addField.payments[x].name && $scope.Builder.FormElements[_y8][z].restrict === true) {
	                  return false;
	                }
	              }
	            }
	            $scope.element = '<div compile=\'addField.payments[' + x + '].fieldHTMLTemplate\'></div>';
	            $scope.elementOptions = '<div compile=\'addField.payments[' + x + '].fieldOptionTemplate\'></div>';
	            $scope.restrict = true;
	            for (var _y9 in $scope.addField.payments[x].defaults) {
	              $scope.elementTemp[_y9] = $scope.addField.payments[x].defaults[_y9];
	            }
	          }
	        }
	        for (var _x7 in $scope.addField.others) {
	          if ($scope.addField.others[_x7].name === type) {
	            $scope.element = '<div compile=\'addField.others[' + _x7 + '].fieldHTMLTemplate\'></div>';
	            $scope.elementOptions = '<div compile=\'addField.others[' + _x7 + '].fieldOptionTemplate\'></div>';
	            $scope.restrict = true;
	            for (var _y10 in $scope.addField.others[_x7].defaults) {
	              $scope.elementTemp[_y10] = $scope.addField.others[_x7].defaults[_y10];
	            }
	          }
	        }
	        break;
	    }
	    position = window.draggedLocation === null ? $scope.Builder.FormElements[0].length : window.draggedLocation;
	    var positionPage = window.draggedLocationPage === null ? 0 : window.draggedLocationPage;
	    positionPage = Math.max(positionPage, 0);
	    $scope.Builder.FormElements[positionPage].splice(position, 0, {
	      element: $scope.element,
	      restrict: $scope.restrict,
	      identifier: 'field' + parseInt(tempVar, 10),
	      type: type,
	      elementOptions: $scope.elementOptions,
	      elementDefaults: $scope.elementTemp
	    });
	    setTimeout(function () {
	      jQuery('.dropdown-cover select').trigger('change');
	    }, 300);
	    $scope.updateListOfFields();
	    $scope.Options.showFields = false;

	    window.draggedLocation = null;
	    window.dragged = false;
	  };
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var countries = 'AF==Afghanistan\nAL==Albania\nDZ==Algeria\nAS==American Samoa\nAD==Andorra\nAO==Angola\nAI==Anguilla\nAQ==Antarctica\nAG==Antigua And Barbuda\nAR==Argentina\nAM==Armenia\nAW==Aruba\nAU==Australia\nAT==Austria\nAZ==Azerbaijan\nBS==Bahamas\nBH==Bahrain\nBD==Bangladesh\nBB==Barbados\nBY==Belarus\nBE==Belgium\nBZ==Belize\nBJ==Benin\nBM==Bermuda\nBT==Bhutan\nBO==Bolivia\nBA==Bosnia And Herzegovina\nBW==Botswana\nBV==Bouvet Island\nBR==Brazil\nIO==British Indian Ocean Territory\nBN==Brunei Darussalam\nBG==Bulgaria\nBF==Burkina Faso\nBI==Burundi\nKH==Cambodia\nCM==Cameroon\nCA==Canada\nCV==Cape Verde\nKY==Cayman Islands\nCF==Central African Republic\nTD==Chad\nCL==Chile\nCN==China\nCX==Christmas Island\nCC==Cocos (keeling) Islands\nCO==Colombia\nKM==Comoros\nCG==Congo\nCD==Congo, The Democratic Republic Of The\nCK==Cook Islands\nCR==Costa Rica\nCI==Cote D\'ivoire\nHR==Croatia\nCU==Cuba\nCY==Cyprus\nCZ==Czech Republic\nDK==Denmark\nDJ==Djibouti\nDM==Dominica\nDO==Dominican Republic\nTP==East Timor\nEC==Ecuador\nEG==Egypt\nSV==El Salvador\nGQ==Equatorial Guinea\nER==Eritrea\nEE==Estonia\nET==Ethiopia\nFK==Falkland Islands (malvinas)\nFO==Faroe Islands\nFJ==Fiji\nFI==Finland\nFR==France\nGF==French Guiana\nPF==French Polynesia\nTF==French Southern Territories\nGA==Gabon\nGM==Gambia\nGE==Georgia\nDE==Germany\nGH==Ghana\nGI==Gibraltar\nGR==Greece\nGL==Greenland\nGD==Grenada\nGP==Guadeloupe\nGU==Guam\nGT==Guatemala\nGN==Guinea\nGW==Guinea-bissau\nGY==Guyana\nHT==Haiti\nHM==Heard Island And Mcdonald Islands\nVA==Holy See (vatican City State)\nHN==Honduras\nHK==Hong Kong\nHU==Hungary\nIS==Iceland\nIN==India\nID==Indonesia\nIR==Iran, Islamic Republic Of\nIQ==Iraq\nIE==Ireland\nIL==Israel\nIT==Italy\nJM==Jamaica\nJP==Japan\nJO==Jordan\nKZ==Kazakstan\nKE==Kenya\nKI==Kiribati\nKP==Korea, Democratic People\'s Republic Of\nKR==Korea, Republic Of\nKV==Kosovo\nKW==Kuwait\nKG==Kyrgyzstan\nLA==Lao People\'s Democratic Republic\nLV==Latvia\nLB==Lebanon\nLS==Lesotho\nLR==Liberia\nLY==Libyan Arab Jamahiriya\nLI==Liechtenstein\nLT==Lithuania\nLU==Luxembourg\nMO==Macau\nMK==Macedonia, The Former Yugoslav Republic Of\nMG==Madagascar\nMW==Malawi\nMY==Malaysia\nMV==Maldives\nML==Mali\nMT==Malta\nMH==Marshall Islands\nMQ==Martinique\nMR==Mauritania\nMU==Mauritius\nYT==Mayotte\nMX==Mexico\nFM==Micronesia, Federated States Of\nMD==Moldova, Republic Of\nMC==Monaco\nMN==Mongolia\nMS==Montserrat\nME==Montenegro\nMA==Morocco\nMZ==Mozambique\nMM==Myanmar\nNA==Namibia\nNR==Nauru\nNP==Nepal\nNL==Netherlands\nAN==Netherlands Antilles\nNC==New Caledonia\nNZ==New Zealand\nNI==Nicaragua\nNE==Niger\nNG==Nigeria\nNU==Niue\nNF==Norfolk Island\nMP==Northern Mariana Islands\nNO==Norway\nOM==Oman\nPK==Pakistan\nPW==Palau\nPS==Palestinian Territory, Occupied\nPA==Panama\nPG==Papua New Guinea\nPY==Paraguay\nPE==Peru\nPH==Philippines\nPN==Pitcairn\nPL==Poland\nPT==Portugal\nPR==Puerto Rico\nQA==Qatar\nRE==Reunion\nRO==Romania\nRU==Russian Federation\nRW==Rwanda\nSH==Saint Helena\nKN==Saint Kitts And Nevis\nLC==Saint Lucia\nPM==Saint Pierre And Miquelon\nVC==Saint Vincent And The Grenadines\nWS==Samoa\nSM==San Marino\nST==Sao Tome And Principe\nSA==Saudi Arabia\nSN==Senegal\nRS==Serbia\nSC==Seychelles\nSL==Sierra Leone\nSG==Singapore\nSK==Slovakia\nSI==Slovenia\nSB==Solomon Islands\nSO==Somalia\nZA==South Africa\nGS==South Georgia And The South Sandwich Islands\nES==Spain\nLK==Sri Lanka\nSD==Sudan\nSR==Suriname\nSJ==Svalbard And Jan Mayen\nSZ==Swaziland\nSE==Sweden\nCH==Switzerland\nSY==Syrian Arab Republic\nTW==Taiwan, Province Of China\nTJ==Tajikistan\nTZ==Tanzania, United Republic Of\nTH==Thailand\nTG==Togo\nTK==Tokelau\nTO==Tonga\nTT==Trinidad And Tobago\nTN==Tunisia\nTR==Turkey\nTM==Turkmenistan\nTC==Turks And Caicos Islands\nTV==Tuvalu\nUG==Uganda\nUA==Ukraine\nAE==United Arab Emirates\nGB==United Kingdom\nUS==United States\nUM==United States Minor Outlying Islands\nUY==Uruguay\nUZ==Uzbekistan\nVU==Vanuatu\nVE==Venezuela\nVN==Viet Nam\nVG==Virgin Islands, British\nVI==Virgin Islands, U.s.\nWF==Wallis And Futuna\nEH==Western Sahara\nYE==Yemen\nZM==Zambia\nZW==Zimbabwe';
	exports.countries = countries;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var nationalities = 'Afghan\nAlbanian\nAlgerian\nAmerican\nAndorran\nAngolan\nAntiguans\nArgentinean\nArmenian\nAustralian\nAustrian\nAzerbaijani\nBahamian\nBahraini\nBangladeshi\nBarbadian\nBarbudans\nBatswana\nBelarusian\nBelgian\nBelizean\nBeninese\nBhutanese\nBolivian\nBosnian\nBrazilian\nBritish\nBruneian\nBulgarian\nBurkinabe\nBurmese\nBurundian\nCambodian\nCameroonian\nCanadian\nCape Verdean\nCentral African\nChadian\nChilean\nChinese\nColombian\nComoran\nCongolese\nCongolese\nCosta Rican\nCroatian\nCuban\nCypriot\nCzech\nDanish\nDjibouti\nDominican\nDominican\nDutch\nDutchman\nDutchwoman\nEast Timorese\nEcuadorean\nEgyptian\nEmirian\nEquatorial Guinean\nEritrean\nEstonian\nEthiopian\nFijian\nFilipino\nFinnish\nFrench\nGabonese\nGambian\nGeorgian\nGerman\nGhanaian\nGreek\nGrenadian\nGuatemalan\nGuinea-Bissauan\nGuinean\nGuyanese\nHaitian\nHerzegovinian\nHonduran\nHungarian\nI-Kiribati\nIcelander\nIndian\nIndonesian\nIranian\nIraqi\nIrish\nIrish\nIsraeli\nItalian\nIvorian\nJamaican\nJapanese\nJordanian\nKazakhstani\nKenyan\nKittian and Nevisian\nKuwaiti\nKyrgyz\nLaotian\nLatvian\nLebanese\nLiberian\nLibyan\nLiechtensteiner\nLithuanian\nLuxembourger\nMacedonian\nMalagasy\nMalawian\nMalaysian\nMaldivan\nMalian\nMaltese\nMarshallese\nMauritanian\nMauritian\nMexican\nMicronesian\nMoldovan\nMonacan\nMongolian\nMoroccan\nMosotho\nMotswana\nMozambican\nNamibian\nNauruan\nNepalese\nNetherlander\nNew Zealander\nNi-Vanuatu\nNicaraguan\nNigerian\nNigerien\nNorth Korean\nNorthern Irish\nNorwegian\nOmani\nPakistani\nPalauan\nPanamanian\nPapua New Guinean\nParaguayan\nPeruvian\nPolish\nPortuguese\nQatari\nRomanian\nRussian\nRwandan\nSaint Lucian\nSalvadoran\nSamoan\nSan Marinese\nSao Tomean\nSaudi\nScottish\nSenegalese\nSerbian\nSeychellois\nSierra Leonean\nSingaporean\nSlovakian\nSlovenian\nSolomon Islander\nSomali\nSouth African\nSouth Korean\nSpanish\nSri Lankan\nSudanese\nSurinamer\nSwazi\nSwedish\nSwiss\nSyrian\nTaiwanese\nTajik\nTanzanian\nThai\nTogolese\nTongan\nTrinidadian or Tobagonian\nTunisian\nTurkish\nTuvaluan\nUgandan\nUkrainian\nUruguayan\nUzbekistani\nVenezuelan\nVietnamese\nWelsh\nWelsh\nYemenite\nZambian\nZimbabwean';
	exports.nationalities = nationalities;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var languages = 'AF==Afrikanns\nSQ==Albanian\nAR==Arabic\nHY==Armenian\nEU==Basque\nBN==Bengali\nBG==Bulgarian\nCA==Catalan\nKM==Cambodian\nZH==Chinese (Mandarin)\nHR==Croation\nCS==Czech\nDA==Danish\nNL==Dutch\nEN==English\nET==Estonian\nFJ==Fiji\nFI==Finnish\nFR==French\nKA==Georgian\nDE==German\nEL==Greek\nGU==Gujarati\nHE==Hebrew\nHI==Hindi\nHU==Hungarian\nIS==Icelandic\nID==Indonesian\nGA==Irish\nIT==Italian\nJA==Japanese\nJW==Javanese\nKO==Korean\nLA==Latin\nLV==Latvian\nLT==Lithuanian\nMK==Macedonian\nMS==Malay\nML==Malayalam\nMT==Maltese\nMI==Maori\nMR==Marathi\nMN==Mongolian\nNE==Nepali\nNO==Norwegian\nFA==Persian\nPL==Polish\nPT==Portuguese\nPA==Punjabi\nQU==Quechua\nRO==Romanian\nRU==Russian\nSM==Samoan\nSR==Serbian\nSK==Slovak\nSL==Slovenian\nES==Spanish\nSW==Swahili\nSV==Swedish \nTA==Tamil\nTT==Tatar\nTE==Telugu\nTH==Thai\nBO==Tibetan\nTO==Tonga\nTR==Turkish\nUK==Ukranian\nUR==Urdu\nUZ==Uzbek\nVI==Vietnamese\nCY==Welsh\nXH==Xhosa';
	exports.languages = languages;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var states = 'AL==Alabama\nAK==Alaska\nAZ==Arizona\nAR==Arkansas\nCA==California\nCO==Colorado\nCT==Connecticut\nDE==Delaware\nFL==Florida\nGA==Georgia\nHI==Hawaii\nID==Idaho\nIL==Illinois\nIN==Indiana\nIA==Iowa\nKS==Kansas\nKY==Kentucky\nLA==Louisiana\nME==Maine\nMD==Maryland\nMA==Massachusetts\nMI==Michigan\nMN==Minnesota\nMS==Mississippi\nMO==Missouri\nMT==Montana\nNE==Nebraska\nNV==Nevada\nNH==New Hampshire\nNJ==New Jersey\nNM==New Mexico\nNY==New York\nNC==North Carolina\nND==North Dakota\nOH==Ohio\nOK==Oklahoma\nOR==Oregon\nPA==Pennsylvania\nRI==Rhode Island\nSC==South Carolina\nSD==South Dakota\nTN==Tennessee\nTX==Texas\nUT==Utah\nVT==Vermont\nVA==Virginia\nWA==Washington\nWV==West Virginia\nWI==Wisconsin\nWY==Wyoming';
	exports.states = states;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var icons = [];
	icons.push({ Name: 'None', Value: 'no-icon' });
	icons.push({ Name: 'Datepicker', Value: 'icon-calendar' });
	icons.push({ Name: 'Search', Value: 'icon-search' });
	icons.push({ Name: 'Email', Value: 'icon-mail' });
	icons.push({ Name: 'Attach', Value: 'icon-attach' });
	icons.push({ Name: 'Picture', Value: 'icon-picture' });
	icons.push({ Name: 'Phone', Value: 'icon-phone' });
	icons.push({ Name: 'Heart', Value: 'icon-heart' });
	icons.push({ Name: 'Star', Value: 'icon-star' });
	icons.push({ Name: 'Help', Value: 'icon-help' });
	icons.push({ Name: 'Code', Value: 'icon-code' });
	icons.push({ Name: 'Square', Value: 'icon-check-empty' });
	icons.push({ Name: 'Circle', Value: 'icon-circle-thin' });
	icons.push({ Name: 'Clock', Value: 'icon-clock-1' });
	icons.push({ Name: 'Scissors', Value: 'icon-scissors' });
	icons.push({ Name: 'Pencil', Value: 'icon-pencil' });
	icons.push({ Name: 'Document', Value: 'icon-doc-text' });
	icons.push({ Name: 'Cog', Value: 'icon-cog' });
	icons.push({ Name: 'Move', Value: 'icon-move' });
	icons.push({ Name: 'Cancel', Value: 'icon-cancel' });
	icons.push({ Name: 'Thumb', Value: 'icon-thumbs-up' });
	icons.push({ Name: 'Thumb', Value: 'icon-thumbs-down' });
	icons.push({ Name: 'Facebook', Value: 'icon-facebook-squared' });
	icons.push({ Name: 'Twitter', Value: 'icon-twitter' });
	icons.push({ Name: 'Youtube', Value: 'icon-youtube-play' });
	icons.push({ Name: 'Dropbox', Value: 'icon-dropbox' });
	icons.push({ Name: 'Github', Value: 'icon-github' });
	icons.push({ Name: 'Linkedin', Value: 'icon-linkedin-squared' });
	icons.push({ Name: 'Pinterest', Value: 'icon-pinterest-circled' });
	icons.push({ Name: 'WordPress', Value: 'icon-wordpress' });
	icons.push({ Name: 'User', Value: 'icon-user' });
	icons.push({ Name: 'Bookmark', Value: 'icon-bookmark-empty' });
	icons.push({ Name: 'Home', Value: 'icon-home' });
	icons.push({ Name: 'PDF', Value: 'icon-file-pdf' });
	icons.push({ Name: 'Word', Value: 'icon-file-word' });
	icons.push({ Name: 'Excel', Value: 'icon-file-excel' });
	icons.push({ Name: 'Powerpoint', Value: 'icon-file-powerpoint' });
	icons.push({ Name: 'Image', Value: 'icon-file-image' });
	icons.push({ Name: 'Archive', Value: 'icon-file-archive' });
	icons.push({ Name: 'Audio', Value: 'icon-file-audio' });
	icons.push({ Name: 'Video', Value: 'icon-file-video' });
	icons.push({ Name: 'Code', Value: 'icon-file-code' });
	icons.push({ Name: 'Folder', Value: 'icon-folder-empty' });
	icons.push({ Name: 'Mic', Value: 'icon-mic' });
	icons.push({ Name: 'Volume', Value: 'icon-volume-up' });
	icons.push({ Name: 'Lightbulb', Value: 'icon-lightbulb' });
	icons.push({ Name: 'Laptop', Value: 'icon-laptop' });
	icons.push({ Name: 'Tablet', Value: 'icon-tablet' });
	icons.push({ Name: 'Mobile', Value: 'icon-mobile' });
	icons.push({ Name: 'Globe', Value: 'icon-globe' });
	icons.push({ Name: 'Briefcase', Value: 'icon-briefcase' });
	icons.push({ Name: 'Off', Value: 'icon-off' });
	icons.push({ Name: 'Smile', Value: 'icon-smile' });
	icons.push({ Name: 'Frown', Value: 'icon-frown' });
	icons.push({ Name: 'Meh', Value: 'icon-meh' });
	exports.icons = icons;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var fieldHTML = [];
	var fieldOptions = [];

	var columnWidthTemplate = '<label class=\'w-1\'><span>Col. Width</span><input type=\'text\' ng-model=\'element.elementDefaults.field_width\'><i data-html=\'true\' tooltip data-placement=\'top\' data-toggle=\'tooltip\' title=\'Set the widths of two fields to <Strong>50%</strong> each to fit them in one row.<br>You can have any number of fields in the same row, as long as the sum of widths is <strong>100%</strong><img src="' + FC.pluginurl + '/assets/images/width-info.png" style="width: 100%; height: 54px"/>\' class=\'icon-help\'></i></label>';
	var labelAndSubLabelTemplate = '<label class="w-1"><span>Label</span><input fc-placeholder type="text" ng-model="element.elementDefaults.main_label"></label><label class="w-1"><span>Sub Label</span><input sub-label type="text" ng-model="element.elementDefaults.sub_label"></label>';
	var instructionsTemplate = '<label class="w-2"><span>Instructions</span><input type="text" ng-model="element.elementDefaults.instructions"></label>';
	var hideFieldTemplate = '<label class="w-3"><input value="1" type="checkbox" ng-model="element.elementDefaults.hidden_default"> Hide Field on Page Load</label>';

	fieldHTML.heading = '<div style="background-color: {{element.elementDefaults.background_color}}" class="heading-cover field-cover"><div style="text-align: {{element.elementDefaults.headingAlignment}}; font-size: {{element.elementDefaults.headingSize}}em; padding-top: {{element.elementDefaults.paddingTop}}; padding-bottom: {{element.elementDefaults.paddingBottom}}; color: {{element.elementDefaults.font_color}}" class="bold-{{element.elementDefaults.headingWeight}}" compile="element.elementDefaults.field_value"></div><input type="hidden" data-field-id="{{element.elementDefaults.identifier}}" name="{{element.elementDefaults.identifier}}[]" value="{{element.elementDefaults.field_value}}"></div>';
	fieldOptions.heading = '<label class=\'w-2\'><span>Label</span><input fc-placeholder type=\'text\' ng-model=\'element.elementDefaults.main_label\'></label>' + columnWidthTemplate + '<label class=\'w-3\'><span>Heading Text</span><input sub-label type=\'text\' ng-model=\'element.elementDefaults.field_value\'></label><label class=\'w2-1\'><span>Padding Top</span><input type=\'text\' ng-model=\'element.elementDefaults.paddingTop\' placeholder=\'10px\'/></label><label class=\'w2-1\'><span>Padding Bottom</span><input type=\'text\' ng-model=\'element.elementDefaults.paddingBottom\' placeholder=\'10px\'/></label><div class=\'w-3 heading-sizes hide-checkbox\'><span class=\'button active\' ng-click=\'element.elementDefaults.headingSize = element.elementDefaults.headingSize + 0.1\'>A+</span><span class=\'button active\' ng-click=\'element.elementDefaults.headingSize = element.elementDefaults.headingSize - 0.1\'>A-</span><label class=\'button\' style=\'margin-left: 10px\'>B<input type=\'checkbox\' value=\'bold\' ng-model=\'element.elementDefaults.headingWeight\' update-label/></label><label class=\'button\' style=\'margin-left: 10px\'><i class=\'icon-align-left\'></i><input type=\'radio\' value=\'left\' ng-model=\'element.elementDefaults.headingAlignment\' update-label/></label><label class=\'button\'><i class=\'icon-align-center\'></i><input type=\'radio\' value=\'center\' ng-model=\'element.elementDefaults.headingAlignment\' update-label/></label><label class=\'button\'><i class=\'icon-align-right\'></i><input type=\'radio\' value=\'right\' ng-model=\'element.elementDefaults.headingAlignment\' update-label/></label></div><div class=\'w-3\'><p style=\'width: 161px\'>Font Color</p><input angular-color type=\'text\' value=\'#fff\' class=\'color-picker\' ng-model=\'element.elementDefaults.font_color\'></div><div class=\'w-3\'><p style=\'width: 161px\'>Background Color</p><input angular-color type=\'text\' value=\'#fff\' class=\'color-picker\' ng-model=\'element.elementDefaults.background_color\'></div>' + hideFieldTemplate;

	fieldHTML.oneLineText = '<div class="oneLineText-cover field-cover"><span class="sub-label-{{element.elementDefaults.has_sub_label}}"><span compile="element.elementDefaults.main_label" class="main-label"></span><span class="sub-label" compile="element.elementDefaults.sub_label"></span></span><div><span class="error"></span><input type="text" placeholder="{{element.elementDefaults.main_label_placeholder}}" data-field-id="{{element.elementDefaults.identifier}}" name="{{element.elementDefaults.identifier}}[]" data-min-char="{{element.elementDefaults.Validation.minChar}}" data-max-char="{{element.elementDefaults.Validation.maxChar}}" data-val-type="{{element.elementDefaults.Validation.allowed}}" data-regexp="{{element.elementDefaults.Validation.regexp}}" data-is-required="{{element.elementDefaults.required}}" data-allow-spaces="{{element.elementDefaults.Validation.spaces}}" class="validation-lenient" data-placement="right" data-toggle="tooltip" tooltip title="{{element.elementDefaults.instructions}}" data-trigger="focus" data-html="true" data-input-mask="{{element.elementDefaults.mask}}" data-mask-placeholder="{{element.elementDefaults.maskPlaceholder}}"><i class="{{element.elementDefaults.selectedIcon}}"></i></div></div>';
	fieldOptions.oneLineText = '' + labelAndSubLabelTemplate + columnWidthTemplate + instructionsTemplate + '<div class=\'w-1 icons-list\'><div><span class=\'super\'>Icon: </span><span ng-click=\'element.showIcons = !element.showIcons\'><i class=\'{{element.elementDefaults.selectedIcon}}\'></i></span><div class=\'hide-checkbox\' ng-show=\'element.showIcons\'><label ng-repeat=\'icon in listIcons\'><input type=\'radio\' name=\'{{element.elementDefaults.identifier}}_icon\' update-label ng-model=\'element.elementDefaults.selectedIcon\' value=\'{{icon.Value}}\'/><i class=\'{{icon.Value}}\'></i></label></div></div></div><label class=\'w2-1\'><span>Input Mask</span><input type=\'text\' ng-model=\'element.elementDefaults.mask\'><i data-html=\'true\' tooltip data-placement=\'top\' data-toggle=\'tooltip\' title=\'<strong>Common Masks:</strong><br><strong>US Telephone:</strong> (000) 000-0000<br><strong>Zip Code:</strong> 0000-000<br><strong>Social Security:</strong> 000-00-0000<br><strong>CPF:</strong> 000.000.000-00<br><strong>Legend:</strong><br><strong>0</strong> = allow 0 - 9<br><strong>A</strong> = allow a - z, or 0 - 9<br><strong>S</strong> = allow a - z\' class=\'icon-help\'></i></label><label class=\'w2-1\'><span>Mask Placeholder</span><input type=\'text\' ng-model=\'element.elementDefaults.maskPlaceholder\'></label><label class=\'w-3\'><span>Validation</span><select ng-model=\'element.elementDefaults.Validation.allowed\'><option value=\'\'>None</option><option value=\'alphabets\'>Only Alphabets</option><option value=\'numbers\'>Only Numbers</option><option value=\'alphanumeric\'>Only Alphabets & Numbers</option><option value=\'url\'>URL</option><option value=\'regexp\'>RegEx</option></select></label><label ng-slide-toggle=\'element.elementDefaults.Validation.allowed=="regexp"\' class=\'w-3\'><span>RegEx</span><input type=\'text\' ng-model=\'element.elementDefaults.Validation.regexp\'><i data-html=\'true\' tooltip data-placement=\'top\' data-toggle=\'tooltip\' title=\'<strong>Common RegExp:</strong><br><strong>/^[a-z0-9_-]{6,18}$/</strong>: allow only alphabets, numbers, underscore and hyphen, and between 6 to 18 characters.<br><strong>/^[a-z0-9-]+$/</strong>: allow only alphabets, numbers and hyphens.<br><strong>/^[a-zA-Z]*$/</strong>: alphabets only, lower or upper case<br><strong>/^[0-9]*$/</strong>: digits only\' class=\'icon-help\'></i></label><label class=\'w2-1\'><span>Min Chars</span><input type=\'text\' ng-model=\'element.elementDefaults.Validation.minChar\'></label><label class=\'w2-1\'><span>Max Chars</span><input type=\'text\' ng-model=\'element.elementDefaults.Validation.maxChar\'></label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.Validation.spaces\'> Allow Spaces</label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate;

	fieldHTML.email = '<div class=\'email-cover field-cover\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div><span class=\'error\'></span><input placeholder=\'{{element.elementDefaults.main_label_placeholder}}\' data-field-id=\'{{element.elementDefaults.identifier}}\' type=\'text\' data-val-type=\'email\' data-is-required=\'{{element.elementDefaults.required}}\' name=\'{{element.elementDefaults.identifier}}\' class=\'validation-lenient\' data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'focus\' data-html=\'true\'><i class=\'icon-mail\'></i></div></div>';
	fieldOptions.email = '' + labelAndSubLabelTemplate + columnWidthTemplate + instructionsTemplate + '<label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.autoresponder\'> Send Autoresponder <a data-toggle=\'fc_modal\' data-target=\'#autoresponder_modal\'>(configure)</a></label></label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.replyTo\'> Set as Reply-To Address</label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate;

	fieldHTML.password = '<div class=\'password-cover field-cover\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div><span class=\'error\'></span><input placeholder=\'{{element.elementDefaults.main_label_placeholder}}\' data-field-id=\'{{element.elementDefaults.identifier}}\' type=\'password\' data-min-char=\'{{element.elementDefaults.Validation.minChar}}\' data-max-char=\'{{element.elementDefaults.Validation.maxChar}}\' data-val-type=\'{{element.elementDefaults.Validation.allowed}}\' data-regexp=\'{{element.elementDefaults.Validation.regexp}}\' data-is-required=\'{{element.elementDefaults.required}}\' name=\'{{element.elementDefaults.identifier}}\' class=\'validation-lenient\' data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'focus\' data-html=\'true\'></div></div>';
	fieldOptions.password = '' + labelAndSubLabelTemplate + columnWidthTemplate + instructionsTemplate + '<label class=\'w-3\'><span>Validation</span><select ng-model=\'element.elementDefaults.Validation.allowed\'><option value=\'>None</option><option value=\'alphabets\'>Only Alphabets</option><option value=\'numbers\'>Only Numbers</option><option value=\'alphanumeric\'>Only Alphabets & Numbers</option><option value=\'regexp\'>RegEx</option></select></label><label ng-slide-toggle=\'element.elementDefaults.Validation.allowed=="regexp"\' class=\'w-3\'><span>RegEx</span><input type=\'text\' ng-model=\'element.elementDefaults.Validation.regexp\'><i data-html=\'true\' tooltip data-placement=\'top\' data-toggle=\'tooltip\' title=\'<strong>Common RegExp:</strong><br><strong>/^[a-z0-9_-]{6,18}$/</strong>: allow only alphabets, numbers, underscore and hyphen, and between 6 to 18 characters.<br><strong>/^[a-z0-9-]+$/</strong>: allow only alphabets, numbers and hyphens.<br><strong>/^[a-zA-Z]*$/</strong>: alphabets only, lower or upper case<br><strong>/^[0-9]*$/</strong>: digits only\' class=\'icon-help\'></i></label><label class=\'w2-1\'><span>Min Chars</span><input type=\'text\' ng-model=\'element.elementDefaults.Validation.minChar\'></label><label class=\'w2-1\'><span>Max Chars</span><input type=\'text\' ng-model=\'element.elementDefaults.Validation.maxChar\'></label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.Validation.spaces\'> Allow Spaces</label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate;

	fieldHTML.textarea = '<div class=\'textarea-cover field-cover\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div><span class=\'error\'></span><textarea data-field-id=\'{{element.elementDefaults.identifier}}\' placeholder=\'{{element.elementDefaults.main_label_placeholder}}\' class=\'validation-lenient\' name=\'{{element.elementDefaults.identifier}}\' value=\'\' rows=\'{{element.elementDefaults.field_height}}\' data-min-char=\'{{element.elementDefaults.Validation.minChar}}\' data-max-char=\'{{element.elementDefaults.Validation.maxChar}}\' data-is-required=\'{{element.elementDefaults.required}}\' data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'focus\' data-html=\'true\'></textarea><div class=\'count-{{element.elementDefaults.show_count}}\'><span class=\'current-count\'>0</span> / <span class=\'max-count\'>{{element.elementDefaults.Validation.maxChar}}</span></div></div></div>';
	fieldOptions.textarea = '' + labelAndSubLabelTemplate + columnWidthTemplate + instructionsTemplate + '<label class=\'w-1\'><span>Rows</span><input type=\'text\' ng-model=\'element.elementDefaults.field_height\'></label><label class=\'w-1\'><span>Min Chars</span><input type=\'text\' ng-model=\'element.elementDefaults.Validation.minChar\'></label><label class=\'w-1\'><span>Max Chars</span><input type=\'text\' ng-model=\'element.elementDefaults.Validation.maxChar\'></label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.show_count\'> Show Character Count</label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate;

	fieldHTML.checkbox = '<div class=\'images-{{element.elementDefaults.allow_images}} checkbox-cover field-cover\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'hover\' data-html=\'true\'><span class=\'error\'></span><label ng-repeat=\'opt in element.elementDefaults.optionsListShow\' style=\'width: {{element.elementDefaults.option_width}}\'><img src=\'{{element.elementDefaults.imagesListShow[$index].url}}\'/><input data-field-id=\'{{element.elementDefaults.identifier}}\' type=\'{{element.elementDefaults.allow_multiple}}\' data-is-required=\'{{element.elementDefaults.required}}\' name=\'{{element.elementDefaults.identifier}}[]\' value=\'{{opt.value}}\' class=\'validation-lenient\'><span compile=\'opt.show\'></span></label></div></div>';
	fieldOptions.checkbox = '<label class=\'w-1\'><span>Label</span><input type=\'text\' ng-model=\'element.elementDefaults.main_label\'></label><label class=\'w-1\'><span>Sub Label</span><input sub-label type=\'text\' ng-model=\'element.elementDefaults.sub_label\'></label>' + columnWidthTemplate + '<label class=\'w-3\'><span>Instructions</span><input type=\'text\' ng-model=\'element.elementDefaults.instructions\'></label><label class=\'w-3\'><input type=\'checkbox\' value=\'true\' ng-model=\'element.elementDefaults.allow_images\'> Add Images</label><div class=\'images-{{element.elementDefaults.allow_images}}\'><label class=\'w-3\'><i class=\'icon-help-circled\' tooltip data-toggle=\'tooltip\' title=\'You can set the value of the checkbox different from the text, using this pattern: <br><strong>100==Apple</strong><br>Here, <strong>100</strong> would be the value, and <strong>Apple</strong> would be the text.<img style="height: 50px" src="' + FC.pluginurl + '/assets/images/value==text.png"/>\'></i><span>Options</span><a data-post-id=\'489\' class=\'trigger-help read-more-textarea\'>read more</a><textarea rows=\'5\' ng-model=\'element.elementDefaults.options_list\' checkbox-list></textarea></label><label class=\'w-3 w-3-images\'><i class=\'icon-help-circled\' tooltip data-toggle=\'tooltip\' title=\'Paste the URL of an image here. This image will be assigned to the first option in your field.<br>Press enter, and paste another URL. This will be assigned to the second option, and so on ...\'></i><span>Images</span><textarea rows=\'5\' ng-model=\'element.elementDefaults.images_list\' image-list></textarea></label></div><label class=\'w-3\'><span>Option Width</span><input type=\'text\' ng-model=\'element.elementDefaults.option_width\'></label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.allow_multiple\' ng-true-value=\'"checkbox"\' ng-false-value=\'"radio"\'> Allow Multiple Selections</label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate;

	fieldHTML.dropdown = '<div class=\'dropdown-cover field-cover\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div><span class=\'error\'></span><select data-is-required=\'{{element.elementDefaults.required}}\' class=\'validation-lenient\' data-field-id=\'{{element.elementDefaults.identifier}}\' name=\'{{element.elementDefaults.identifier}}\' data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'hover\' data-html=\'true\'><option value=\'{{opt.value}}\' ng-repeat=\'opt in element.elementDefaults.optionsListShow\'>{{opt.show}}</option></select></div></div>';
	fieldOptions.dropdown = '<label class=\'w-1\'><span>Label</span><input type=\'text\' ng-model=\'element.elementDefaults.main_label\'></label><label class=\'w-1\'><span>Sub Label</span><input fc-placeholder sub-label type=\'text\' ng-model=\'element.elementDefaults.sub_label\'></label>' + columnWidthTemplate + instructionsTemplate + '<label class=\'w-3\'><i class=\'icon-help-circled\' tooltip data-toggle=\'tooltip\' title=\'You can set the value of the dropdown options different from the text, using this pattern: <br><strong>en==English</strong><br>Here, <strong>en</strong> would be the value, and <strong>English</strong> would be the text.<img style=\' + \'"height: 50px"\' + \' src=\' + \'"\' + FC.pluginurl + \'/assets/images/value==text2.png"\' + \'/>\'></i><span>Options</span><a data-post-id=\'489\' class=\'trigger-help read-more-textarea\'>read more</a><textarea rows=\'5\' ng-model=\'element.elementDefaults.options_list\' checkbox-list></textarea></label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate + '<div class=\'w-3\' style=\'white-space:normal\'>Autofill: <a ng-click=\'addCountries($parent.$index, $index)\'>Countries</a>, <a ng-click=\'addStates($parent.$index, $index)\'>US States</a>, <a ng-click=\'addNationalities($parent.$index, $index)\'>Nationalities</a>, <a ng-click=\'addLanguages($parent.$index, $index)\'>Languages</a>, <a ng-click=\'addDays($parent.$index, $index)\'>Days of the Week</a>, <a ng-click=\'addMonths($parent.$index, $index)\'>Months</a></div>';

	fieldHTML.datepicker = '<div class=\'datepicker-cover field-cover\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div><span class=\'error\'></span><input data-field-id=\'{{element.elementDefaults.identifier}}\' data-field-id=\'{{element.elementDefaults.identifier}}\' placeholder=\'{{element.elementDefaults.main_label_placeholder}}\' type=\'text\' class=\'validation-lenient\' data-is-required=\'{{element.elementDefaults.required}}\' datepicker data-date-format=\'{{element.elementDefaults.dateFormat}}\' data-date-days=\'{{element.elementDefaults.dateDays}}\' data-date-min=\'{{element.elementDefaults.minDate}}\' data-date-min-alt=\'{{element.elementDefaults.minDateAlt}}\' data-date-max-alt=\'{{element.elementDefaults.maxDateAlt}}\' data-date-max=\'{{element.elementDefaults.maxDate}}\' data-date-lang=\'{{element.elementDefaults.dateLang}}\' name=\'{{element.elementDefaults.identifier}}\' data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'focus\' data-html=\'true\' ng-model=\'temp\'><i class=\'icon-calendar\'></i></div></div>';
	fieldOptions.datepicker = '' + labelAndSubLabelTemplate + columnWidthTemplate + instructionsTemplate + '<label class=\'w2-1\'><span>Lang</span><select ng-model=\'element.elementDefaults.dateLang\'><option value=\'en\'>English</option><option ng-repeat=\'lang in dateLang\' ng-value=\'lang\'>{{lang}}</option></select></label><label class=\'w2-1\'><span>Format</span><select ng-model=\'element.elementDefaults.dateFormat\'><option>M d, yy</option><option>d M yy</option><option>yy-mm-dd</option><option>dd/mm/yy</option><option>mm/dd/yy</option></select></label><label class=\'w2-1\'><i class=\'icon-help-circled\' tooltip data-toggle=\'tooltip\' title=\'To set today as the min allowed date, type in:<br><strong>0</strong><br>To set day-before-yesterday as the min date, type in <br><strong>-2</strong>\'></i><span>Min Date</span><input data-default-date=\'{{element.elementDefaults.minDate}}\' type=\'text\' data-date-format=\'yy-mm-dd\' datepicker ng-model=\'element.elementDefaults.minDate\'></label><label class=\'w2-1\'><i class=\'icon-help-circled\' tooltip data-toggle=\'tooltip\' title=\'To set today as the max allowed date, type in:<br><strong>0</strong><br>To set day-after-tomorrow as the max date, type in <br><strong>2</strong>\'></i><span>Max Date</span><input data-default-date=\'{{element.elementDefaults.maxDate}}\' type=\'text\' data-date-format=\'yy-mm-dd\' datepicker ng-model=\'element.elementDefaults.maxDate\' data-date-min=\'{{element.elementDefaults.minDate}}\'></label><div class=\'w-3 hide-checkbox week-days\'><strong>Days Allowed:</strong><br><label class=\'button\'>Sunday<input type=\'checkbox\' ng-model=\'element.elementDefaults.dateDays[0]\' update-label/></label><label class=\'button\'>Monday<input type=\'checkbox\' ng-model=\'element.elementDefaults.dateDays[1]\' update-label/></label><label class=\'button\'>Tuesday<input type=\'checkbox\' ng-model=\'element.elementDefaults.dateDays[2]\' update-label/></label><label class=\'button\'>Wednesday<input type=\'checkbox\' ng-model=\'element.elementDefaults.dateDays[3]\' update-label/></label><br><label class=\'button\'>Thursday<input type=\'checkbox\' ng-model=\'element.elementDefaults.dateDays[4]\' update-label/></label><label class=\'button\'>Friday<input type=\'checkbox\' ng-model=\'element.elementDefaults.dateDays[5]\' update-label/></label><label class=\'button\'>Saturday<input type=\'checkbox\' ng-model=\'element.elementDefaults.dateDays[6]\' update-label/></label></div><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate;

	fieldHTML.customText = '<div class=\'absolute-{{element.elementDefaults.floating_type}} customText-cover field-cover\' style=\'left: {{element.elementDefaults.leftPosition}}; top: {{element.elementDefaults.topPosition}};right: {{element.elementDefaults.rightPosition}};bottom: {{element.elementDefaults.bottomPosition}};color: {{element.elementDefaults.font_color}} !important; background-color: {{element.elementDefaults.background_color}}\'><div class=\'full\' compile=\'element.elementDefaults.html\' style=\'text-align: {{element.elementDefaults.alignment}}\'></div><input type=\'hidden\' name=\'{{element.elementDefaults.identifier}}\' value=\'{{element.elementDefaults.field_value}}\' data-field-id=\'{{element.elementDefaults.identifier}}\'></div>';
	fieldOptions.customText = '<label class=\'w-2\'><span>Label</span><input type=\'text\' ng-model=\'element.elementDefaults.main_label\'></label>' + columnWidthTemplate + '<label class=\'w-3\'><span>Field Value</span><input type=\'text\' ng-model=\'element.elementDefaults.field_value\'></label><div class=\'w-1\' style=\'width: 20%; font-weight: bold\'>Margin</div><div style=\'width: 80%\' class=\'w-2 stuck-input\'><span>Top</span><input type=\'text\' placeholder=\'100px\' ng-model=\'element.elementDefaults.topPosition\'/><span>Right</span><input type=\'text\' placeholder=\'100px\' ng-model=\'element.elementDefaults.rightPosition\'/><span>Bottom</span><input type=\'text\' placeholder=\'100px\' ng-model=\'element.elementDefaults.bottomPosition\'/><span>Left</span><input type=\'text\' placeholder=\'100px\' ng-model=\'element.elementDefaults.leftPosition\'/></div><div class=\'hide-checkbox\'><div class=\'w-1\' style=\'width: 20%; font-weight: bold; vertical-align: bottom\'>Display</div><label style=\'width:35%;margin-right:4%\' class=\'w-1\'><img src=\'' + FC.pluginurl + '/assets/images/display-floating.png\'/><input type=\'radio\' update-label name=\'pos_float_{{$index}}\' ng-model=\'element.elementDefaults.floating_type\' value=\'true\'/> Floating</label><label style=\'width:35%\' class=\'w-1\'><img src=\'' + FC.pluginurl + '/assets/images/display-inline.png\'/><input type=\'radio\' update-label name=\'pos_float_{{$index}}\' ng-model=\'element.elementDefaults.floating_type\' value=\'false\'/> Inline</label></div><div class=\'w-3\'><span style=\'position: relative; left: 10px; font-weight: bold; top: 8px; background: white; color: #777\'>Text Content</span><text-angular class=\'textangular\' ng-model=\'element.elementDefaults.html\'></text-angular></div><div class=\'w-3\'><p style=\'width: 192px\'>Font Color</p><input angular-color type=\'text\' value=\'#fff\' class=\'color-picker\' ng-model=\'element.elementDefaults.font_color\'></div><div class=\'w-3\'><p style=\'width: 192px\'>Background Color</p><input angular-color type=\'text\' value=\'#fff\' class=\'color-picker\' ng-model=\'element.elementDefaults.background_color\'></div>' + hideFieldTemplate;

	fieldHTML.submit = '<div class=\'animate-{{element.elementDefaults.doAnimate}} align-{{element.elementDefaults.alignment}} wide-{{element.elementDefaults.isWide}} submit-cover field-cover\'><button type=\'submit\' class=\'button submit-button\'><span class=\'text\'>{{element.elementDefaults.main_label}}</span><span class=\'spin-cover\'><i style=\'color: {{element.elementDefaults.font_color}}\' class=\'loading-icon icon-cog animate-spin\'></i></span></button></div><div class=\'submit-response\'></div><input type=\'text\' class=\'required_field\' name=\'website\'>';
	fieldOptions.submit = '<label class=\'w-2\'><span>Label</span><input type=\'text\' ng-model=\'element.elementDefaults.main_label\'></label>' + columnWidthTemplate + '<div class=\'label w-3 hide-checkbox align-icons\'><label class=\'button\'><input type=\'radio\' update-label name=\'{{element.elementDefaults.identifier}}_name\' ng-model=\'element.elementDefaults.alignment\' value=\'left\'><i class=\'icon-align-left\'></i></label><label class=\'button\'><input type=\'radio\' update-label name=\'{{element.elementDefaults.identifier}}_name\' ng-model=\'element.elementDefaults.alignment\' value=\'center\'><i class=\'icon-align-center\'></i></label><label class=\'button\'><input type=\'radio\' update-label name=\'{{element.elementDefaults.identifier}}_name\' ng-model=\'element.elementDefaults.alignment\' value=\'right\'><i class=\'icon-align-right\'></i></label></div><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.doAnimate\'> Animate Shape on Click</label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.isWide\'> Wide Button</label>' + hideFieldTemplate;

	fieldHTML.fileupload = '<div class=\'wide-{{element.elementDefaults.isWide}} fileupload-cover field-cover\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div><span class=\'error\'></span><div class=\'button button-file fileupload-button\' data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'hover\' data-html=\'true\'><i class=\'icon-upload-cloud\'></i><span>{{element.elementDefaults.button_label}}</span><input type=\'file\' data-name-list=\'{{element.elementDefaults.identifier}}\' name=\'files\' multiple data-allow-extensions=\'{{element.elementDefaults.allow_extensions}}\' data-min-files=\'{{element.elementDefaults.min_files}}\' data-max-files=\'{{element.elementDefaults.max_files}}\' data-max-size=\'{{element.elementDefaults.max_file_size}}\'/></div></div></div>';
	fieldOptions.fileupload = '<label class=\'w-2\'><span>Label</span><input type=\'text\' ng-model=\'element.elementDefaults.main_label\'></label><label class=\'w-1\'><span>Sub Label</span><input type=\'text\' ng-model=\'element.elementDefaults.sub_label\'></label><label class=\'w-2\'><span>Button</span><input type=\'text\' ng-model=\'element.elementDefaults.button_label\'></label>' + columnWidthTemplate + instructionsTemplate + '<label class=\'w-3\'><span>Allowed Extensions</span><i class=\'icon-help-circled\' tooltip data-toggle=\'tooltip\' title=\'Enter the file extensions users are allowed to upload, separated by a comma.<br>Leave blank to allow all file-types.\'></i><input type=\'text\' placeholder=\'jpg, png, gif\' ng-model=\'element.elementDefaults.allow_extensions\'></label><label class=\'w2-1\'><span>Min Files</span><input type=\'text\' ng-model=\'element.elementDefaults.min_files\'></label><label class=\'w2-1\'><span>Max Files</span><input type=\'text\' ng-model=\'element.elementDefaults.max_files\'></label><label class=\'w-3\'><span>Max File Size (in KBs)</span><input type=\'text\' ng-model=\'element.elementDefaults.max_file_size\'></label>' + hideFieldTemplate;

	fieldHTML.slider = '<div class=\'slider-cover field-cover show-scale-{{element.elementDefaults.scale_true}}\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'hover\' data-html=\'true\'><span class=\'error\'></span><span class=\'range-min\'>{{element.elementDefaults.prefix}}{{element.elementDefaults.range_min}}{{element.elementDefaults.suffix}}</span><span class=\'ui-slider-cover\'><span range-min=\'{{element.elementDefaults.range_min}}\' range-max=\'{{element.elementDefaults.range_max}}\' range-step=\'{{element.elementDefaults.range_step}}\' range-true=\'{{element.elementDefaults.range_true}}\' data-prefix=\'{{element.elementDefaults.prefix}}\' data-suffix=\'{{element.elementDefaults.suffix}}\' slider></span></span><span class=\'range-max\'>{{element.elementDefaults.prefix}}{{element.elementDefaults.range_max}}{{element.elementDefaults.suffix}}</span><input name=\'{{element.elementDefaults.identifier}}\' data-field-id=\'{{element.elementDefaults.identifier}}\' type=\'hidden\' class=\'validation-lenient\' data-is-required=\'{{element.elementDefaults.required}}\'/></div></div>';
	fieldOptions.slider = '<label class=\'w-1\'><span>Label</span><input type=\'text\' ng-model=\'element.elementDefaults.main_label\'></label><label class=\'w-1\'><span>Sub Label</span><input type=\'text\' ng-model=\'element.elementDefaults.sub_label\'></label>' + columnWidthTemplate + instructionsTemplate + '<label class=\'w-1\'><span>Min</span><input type=\'text\' ng-model=\'element.elementDefaults.range_min\'></label><label class=\'w-1\'><span>Max</span><input type=\'text\' ng-model=\'element.elementDefaults.range_max\'></label><label class=\'w-1\'><span>Step</span><input type=\'text\' ng-model=\'element.elementDefaults.range_step\'></label><label class=\'w-1\'><span>Prefix</span><input type=\'text\' ng-model=\'element.elementDefaults.prefix\' ng-trim=\'false\'></label><label class=\'w-1\'><span>Suffix</span><input type=\'text\' ng-model=\'element.elementDefaults.suffix\' ng-trim=\'false\'></label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.range_true\' value=\'true\'> Range Selector</label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.scale_true\' value=\'true\'> Show Scale</label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate;

	fieldHTML.timepicker = '<div class=\'timepicker-cover field-cover\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div><span class=\'error\'></span><span class=\'time-fields-cover hide-meridian-{{element.elementDefaults.format_24}}\' data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'hover\' data-html=\'true\'><select update-hours hrs-min=\'{{element.elementDefaults.hrs_min}}\' hrs-max=\'{{element.elementDefaults.hrs_max}}\' hrs-step=\'{{element.elementDefaults.hrs_step}}\'><option ng-repeat=\'hours in element.elementDefaults.hoursRange\' value=\'{{hours}}\'>{{hours}}</option></select><select update-minutes minute-step=\'{{element.elementDefaults.minute_step}}\'><option ng-repeat=\'minute in element.elementDefaults.minute_range\' value=\'{{minute}}\'>{{minute}}</option></select><input type=\'text\' class=\'meridian-picker\' value=\'am\'></span><input type=\'hidden\' name=\'{{element.elementDefaults.identifier}}\' data-field-id=\'{{element.elementDefaults.identifier}}\'><i class=\'icon-clock-1\'></i></div></div>';
	fieldOptions.timepicker = '<label class=\'w-1\'><span>Label</span><input type=\'text\' ng-model=\'element.elementDefaults.main_label\'></label><label class=\'w-1\'><span>Sub Label</span><input type=\'text\' ng-model=\'element.elementDefaults.sub_label\'></label>' + columnWidthTemplate + instructionsTemplate + '<label class=\'w2-1\'><span>Min Hrs</span><input type=\'text\' ng-model=\'element.elementDefaults.hrs_min\'></label><label class=\'w2-1\'><span>Max Hrs</span><input type=\'text\' ng-model=\'element.elementDefaults.hrs_max\'></label><label class=\'w2-1\'><span>Hrs Step</span><input type=\'text\' ng-model=\'element.elementDefaults.hrs_step\'></label><label class=\'w2-1\'><span>Minute Step</span><input type=\'text\' ng-model=\'element.elementDefaults.minute_step\'></label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.format_24\'> Hide AM / PM</label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate;

	fieldHTML.star = '<div class=\'star-cover field-cover\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div class=\'star-label-cover\' data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'hover\' data-html=\'true\'><span class=\'error\'></span><div><label ng-repeat=\'opt in element.elementDefaults.optionsListShow\' tooltip data-toggle=\'tooltip\' title=\'{{opt.show}}\' style=\'width: {{element.elementDefaults.option_width}}\'><div></div><input data-field-id=\'{{element.elementDefaults.identifier}}\' type=\'radio\' data-is-required=\'{{element.elementDefaults.required}}\' name=\'{{element.elementDefaults.identifier}}\' value=\'{{opt.value}}\' class=\'validation-lenient\'></label></div></div></div>';
	fieldOptions.star = '<label class=\'w-1\'><span>Label</span><input type=\'text\' ng-model=\'element.elementDefaults.main_label\'></label><label class=\'w-1\'><span>Sub Label</span><input sub-label type=\'text\' ng-model=\'element.elementDefaults.sub_label\'></label>' + columnWidthTemplate + instructionsTemplate + '<div><label class=\'w-3\'><i class=\'icon-help-circled\' tooltip data-toggle=\'tooltip\' title=\'You can set the value of the star-rating different from the text, using this pattern: <br><strong>5==Excellent!</strong><br>Here, <strong>5</strong> would be the value, and <strong>Excellent!</strong> would be the text visible to the user.\'></i><span>Options</span><textarea rows=\'5\' ng-model=\'element.elementDefaults.options_list\' checkbox-list></textarea></label></div><label class=\'w-3\'><span>Option Width</span><input type=\'text\' ng-model=\'element.elementDefaults.option_width\'></label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate;

	fieldHTML.thumb = '<div class=\'thumb-cover field-cover\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div class=\'thumb-label-cover hide-checkbox update-label\' data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'hover\' data-html=\'true\'><span class=\'error\'></span><div><label ng-class-odd=\'' + '"odd"' + '\' ng-repeat=\'opt in element.elementDefaults.optionsListShow\' tooltip data-toggle=\'tooltip\' title=\'{{opt.show}}\' style=\'width: {{element.elementDefaults.option_width}}\'><i class=\'icon-thumbs-up thumbs-up\'></i><i class=\'icon-thumbs-down thumbs-down\'></i><input data-field-id=\'{{element.elementDefaults.identifier}}\' type=\'radio\' data-is-required=\'{{element.elementDefaults.required}}\' name=\'{{element.elementDefaults.identifier}}\' value=\'{{opt.value}}\' class=\'validation-lenient\'></label></div></div></div>';
	fieldOptions.thumb = '<label class=\'w-1\'><span>Label</span><input type=\'text\' ng-model=\'element.elementDefaults.main_label\'></label><label class=\'w-1\'><span>Sub Label</span><input sub-label type=\'text\' ng-model=\'element.elementDefaults.sub_label\'></label>' + columnWidthTemplate + instructionsTemplate + '<div><label class=\'w-3\'><i class=\'icon-help-circled\' tooltip data-toggle=\'tooltip\' title=\'You can set the value of the thumb-rating different from the text, using this pattern: <br><strong>5==Excellent!</strong><br>Here, <strong>5</strong> would be the value, and <strong>Excellent!</strong> would be the text visible to the user.\'></i><span>Options</span><textarea rows=\'5\' ng-model=\'element.elementDefaults.options_list\' checkbox-list></textarea></label></div><label class=\'w-3\'><span>Option Width</span><input type=\'text\' ng-model=\'element.elementDefaults.option_width\'></label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate;

	fieldHTML.matrix = '<div class=\'matrix-cover field-cover\'><span class=\'sub-label-{{element.elementDefaults.has_sub_label}}\'><span compile=\'element.elementDefaults.main_label\' class=\'main-label\'></span><span class=\'sub-label\' compile=\'element.elementDefaults.sub_label\'></span></span><div><span class=\'error\'></span><div data-placement=\'right\' data-toggle=\'tooltip\' tooltip title=\'{{element.elementDefaults.instructions}}\' data-trigger=\'hover\' data-html=\'true\'><table cellspacing=\'0\' cellpadding=\'0\'><thead><th></th><th ng-repeat=\'col in element.elementDefaults.matrixColumnsOutput\'>{{col.value}}</th></thead><tbody><tr ng-repeat=\'row in element.elementDefaults.matrixRowsOutput\'><td>{{row.value}}</td><td ng-repeat=\'col in element.elementDefaults.matrixColumnsOutput\'><label><input type=\'radio\' name=\'{{element.elementDefaults.identifier}}_{{$parent.$index}}\' value=\'{{col.value}}\'></label></td></tr></tbody></table></div></div></div>';
	fieldOptions.matrix = '<label class=\'w-1\'><span>Label</span><input type=\'text\' ng-model=\'element.elementDefaults.main_label\'></label><label class=\'w-1\'><span>Sub Label</span><input sub-label type=\'text\' ng-model=\'element.elementDefaults.sub_label\'></label>' + columnWidthTemplate + instructionsTemplate + '<div><label class=\'w-3\'><span>Options</span><textarea rows=\'5\' ng-model=\'element.elementDefaults.matrix_rows\' matrix-rows></textarea></label><label class=\'w-3\'><span>Columns</span><textarea rows=\'5\' ng-model=\'element.elementDefaults.matrix_cols\' matrix-cols></textarea></label><label class=\'w-3\'><input type=\'checkbox\' ng-model=\'element.elementDefaults.required\'> Required Field</label>' + hideFieldTemplate;

	exports.fieldHTML = fieldHTML;
	exports.fieldOptions = fieldOptions;

/***/ }
/******/ ]);