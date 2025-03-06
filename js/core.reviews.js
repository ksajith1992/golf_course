"use strict";

jQuery(document).ready(function () {
	"use strict";

	GOLFCLUB_STORAGE['reviews_user_accepted'] = false;

	golfclub_add_hidden_elements_handler('init_reviews', golfclub_init_reviews);

	golfclub_init_reviews(jQuery('body'));
});


// Init reviews elements
function golfclub_init_reviews(cont) {
	"use strict";

	// Drag slider - set new rating
	cont.find('.reviews_editable .reviews_slider:not(.inited)').each(function () {
		"use strict";
		if (typeof(GOLFCLUB_STORAGE['reviews_allow_user_marks']) == 'undefined' || !GOLFCLUB_STORAGE['reviews_allow_user_marks']) return;
		if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
		jQuery(this).addClass('inited');
		var row = jQuery(this).parents('.reviews_item');
		var wrap = jQuery(this).parents('.reviews_stars_wrap');
		var rangeMin = 0;
		var rangeMax = parseInt(row.data('max-level'));
		var step = parseFloat(row.data('step'));
		var prec = Math.pow(10, step.toString().indexOf('.') < 0 ? 0 : step.toString().length - step.toString().indexOf('.') - 1);
		var grid = Math.max(1, (wrap.width() - jQuery(this).width()) / (rangeMax - rangeMin) / prec);
		// Move slider to init position
		var val = parseFloat(row.find('input[type="hidden"]').val());
		var x = Math.round((val - rangeMin) * (wrap.width() - jQuery(this).width()) / (rangeMax - rangeMin));
		golfclub_reviews_set_current_mark(row, val, x, false);
		jQuery(this).draggable({
			axis: 'x',
			grid: [grid, grid],
			containment: '.reviews_stars_wrap',
			scroll: false,
			drag: function (e, ui) {
				"use strict";
				var pos = ui.position.left >= 0 ? ui.position.left : ui.originalPosition.left + ui.offset.left;
				var val = Math.min(rangeMax, Math.max(rangeMin, Math.round(pos * prec * (rangeMax - rangeMin) / (wrap.width() - jQuery(this).width())) / prec + rangeMin));
				golfclub_reviews_set_current_mark(row, val);
			}
		});
	});


	// Click on stars - set new rating
	cont.find('.reviews_editor .reviews_editable .reviews_stars_wrap:not(.inited),.reviews_editor .reviews_max_level_100 .reviews_criteria:not(.inited)').each(function () {
		"use strict";
		if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
		jQuery(this)
			.addClass('inited')
			.on('click', function (e) {
				"use strict";
				if (typeof(GOLFCLUB_STORAGE['reviews_allow_user_marks']) == 'undefined' || !GOLFCLUB_STORAGE['reviews_allow_user_marks']) return;
				if (jQuery(this).hasClass('reviews_criteria') && !jQuery(this).next().hasClass('reviews_editable')) return;
				var wrap = jQuery(this).hasClass('reviews_criteria') ? jQuery(this).next() : jQuery(this);
				var row = wrap.parents('.reviews_item');
				var wrapWidth = wrap.width() - wrap.find('.reviews_slider').width();
				var rangeMin = 0;
				var rangeMax = parseInt(row.data('max-level'));
				var step = parseFloat(row.data('step'));
				var prec = Math.pow(10, step.toString().indexOf('.') < 0 ? 0 : step.toString().length - step.toString().indexOf('.') - 1);
				var grid = wrapWidth / (rangeMax - rangeMin + 1) / step;
				var wrapX = e.pageX - wrap.offset().left;
				if (wrapX <= 1) wrapX = 0;
				if (wrapX > wrapWidth) wrapX = wrapWidth;
				var val = Math.min(rangeMax, Math.max(rangeMin, Math.round(wrapX * prec * (rangeMax - rangeMin) / wrapWidth) / prec + rangeMin));
				golfclub_reviews_set_current_mark(row, val, wrapX);
			});
	});


// Set current mark value
	function golfclub_reviews_set_current_mark(row, val) {
		"use strict";
		var x = arguments[2] != undefined ? arguments[2] : -1;
		var clear = arguments[3] != undefined ? arguments[3] : true;
		var rangeMin = 0;
		var rangeMax = parseInt(row.data('max-level'));
		row.find('.reviews_value').html(val);
		row.find('input[type="hidden"]').val(val).trigger('change');
		row.find('.reviews_stars_hover').css('width', Math.round(row.find('.reviews_stars_bg').width() * val / (rangeMax - rangeMin)) + 'px');
		if (x >= 0) row.find('.reviews_slider').css('left', x + 'px');
		// Clear user marks and show Accept Button
		if (!GOLFCLUB_STORAGE['admin_mode'] && !GOLFCLUB_STORAGE['reviews_user_accepted'] && clear) {
			GOLFCLUB_STORAGE['reviews_user_accepted'] = true;
			row.siblings('.reviews_item').each(function () {
				"use strict";
				jQuery(this).find('.reviews_stars_hover').css('width', 0);
				jQuery(this).find('.reviews_value').html('0');
				jQuery(this).find('.reviews_slider').css('left', 0);
				jQuery(this).find('input[type="hidden"]').val('0');
			});
			// Show Accept button
			row.parent().next().fadeIn();
		}
		golfclub_reviews_set_average_mark(row.parents('.reviews_editor'));
	}

// Show average mark
	function golfclub_reviews_set_average_mark(obj) {
		"use strict";
		var avg = 0;
		var cnt = 0;
		var rangeMin = 0;
		var rangeMax = parseInt(obj.find('.reviews_item').eq(0).data('max-level'));
		var step = parseFloat(obj.find('.reviews_item').eq(0).data('step'));
		var prec = Math.pow(10, step.toString().indexOf('.') < 0 ? 0 : step.toString().length - step.toString().indexOf('.') - 1);
		obj.find('input[type="hidden"]').each(function () {
			avg += parseFloat(jQuery(this).val());
			cnt++;
		});
		avg = cnt > 0 ? avg / cnt : 0;
		avg = Math.min(rangeMax, Math.max(rangeMin, Math.round(avg * prec) / prec + rangeMin));
		var summary = obj.siblings('.reviews_summary');
		summary.find('.reviews_value').html(avg);
		summary.find('input[type="hidden"]').val(avg).trigger('change');
		summary.find('.reviews_stars_hover').css('width', Math.round(summary.find('.reviews_stars_bg').width() * avg / (rangeMax - rangeMin)) + 'px');
	}

// Convert percent to rating marks level
	function golfclub_reviews_marks_to_display(mark) {
		"use strict";
		if (GOLFCLUB_STORAGE['reviews_max_level'] < 100) {
			mark = Math.round(mark / 100 * GOLFCLUB_STORAGE['reviews_max_level'] * 10) / 10;
			if (String(mark).indexOf('.') < 0) {
				mark += '.0';
			}
		}
		return mark;
	}

// Get word-value review rating
	function golfclub_reviews_get_word_value(r) {
		"use strict";
		var words = GOLFCLUB_STORAGE['reviews_levels'].split(',');
		var k = GOLFCLUB_STORAGE['reviews_max_level'] / words.length;
		r = Math.max(0, Math.min(words.length - 1, Math.floor(r / k)));
		return words[r];
	}
}
