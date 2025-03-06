/* Template globals */
"use strict";
    if (typeof GOLFCLUB_STORAGE == 'undefined') var GOLFCLUB_STORAGE = {};
    GOLFCLUB_STORAGE['ajax_url'] = '#';
    GOLFCLUB_STORAGE['ajax_nonce'] = '242cc47d7a';
    GOLFCLUB_STORAGE['theme_font'] = 'Lato';
    GOLFCLUB_STORAGE['menu_fixed'] = true;
    GOLFCLUB_STORAGE['menu_mobile'] = 1024;
    GOLFCLUB_STORAGE['menu_slider'] = true;
    GOLFCLUB_STORAGE['media_elements_enabled'] = true;
    GOLFCLUB_STORAGE['css_animation'] = true;
    GOLFCLUB_STORAGE['menu_animation_in'] = 'fadeInUp';
    GOLFCLUB_STORAGE['menu_animation_out'] = 'fadeOutDown';
    GOLFCLUB_STORAGE['popup_engine'] = 'magnific';
    GOLFCLUB_STORAGE['email_mask'] = '^([a-zA-Z0-9_\-]+\.)*[a-zA-Z0-9_\-]+@[a-z0-9_\-]+(\.[a-z0-9_\-]+)*\.[a-z]{2,6}$';
    GOLFCLUB_STORAGE['isotope_resize_delta'] = 0.3;
    GOLFCLUB_STORAGE['error_message_box'] = null;
    GOLFCLUB_STORAGE['top_panel_height'] = 0;

/* Woocommerce Data */
    var woocommerce_price_slider_params = {
        "currency_symbol": "\u00a3",
        "currency_pos": "left",
        "min_price": "",
        "max_price": ""
    };
    var wc_single_product_params = {
        "i18n_required_rating_text": "Please select a rating",
        "review_rating_required": "yes"
    };

/* Events Calendar Data*/
    var tribe_js_config = {
        "permalink_settings": "#",
        "events_post_type": "tribe_events",
        "events_base": "#"
    };
    var tribeEventsSingleMap = {
        "addresses": [{
            "address": "727 Hagley Rd W Chicago United States ",
            "title": "Club Course"
        }],
        "zoom": "8"
    };

/* Booked Appointments data*/
    var booked_js_vars = {
        "ajax_url": "#"
    };

/* Lessons masonry isotope buttons */
    jQuery(document).ready(function() {
        "use strict";
        jQuery("#sc_blogger_3 .isotope_filters").append("<a href=\"#\" data-filter=\"*\" class=\"theme_button active\">All</a><a href=\"#\" data-filter=\".flt_107\" class=\"theme_button\">Coaching &amp; Tips</a><a href=\"#\" data-filter=\".flt_108\" class=\"theme_button\">Full Swing</a><a href=\"#\" data-filter=\".flt_25\" class=\"theme_button\">technics</a><a href=\"#\" data-filter=\".flt_86\" class=\"theme_button\">competition</a>");
    });