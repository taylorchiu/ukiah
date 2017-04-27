<?php

add_action( 'wp_enqueue_scripts', 'enqueue_parent_styles' );
add_filter( 'gform_enable_field_label_visibility_settings', '__return_true' );
define('WP_SCSS_ALWAYS_RECOMPILE', true);

function enqueue_parent_styles() {
  $template_url 		= get_template_directory_uri();
  $child_theme_url 	= get_stylesheet_directory_uri();

  // WP-SCSS plugin automatically compiles all css files
  // Not sure why the child style.css has to live on the root or it won't override the parent style.css
  // wp_enqueue_style( 'parent-style', $template_url.'/style.css' );
  // wp_enqueue_style( 'uploader_widget', $child_theme_url.'/scss/uploader_widget.scss' );
  // wp_enqueue_style( 'form', $child_theme_url.'/scss/form.scss' );

  // manually add image_uploader script and cloudinary, which will launch the cloudinary widget
  wp_register_script( 'cloudinary', 'https://widget.cloudinary.com/global/all.js', null, null, true );
  wp_enqueue_script('cloudinary');
  wp_register_script('image_uploader', $child_theme_url.'/javascript/cloudinary/image_uploader.js', array('jquery'));
  wp_enqueue_script('image_uploader', $child_theme_url.'/javascript/cloudinary/image_uploader.js' );
  wp_register_script('form', $child_theme_url.'/javascript/form.js', array('jquery'));
  wp_enqueue_script('form');
}
