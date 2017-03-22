<?php

add_action( 'wp_enqueue_scripts', 'enqueue_parent_styles' );

function enqueue_parent_styles() {
  $template_url 		= get_template_directory_uri();
  $child_theme_url 	= get_stylesheet_directory_uri();

  wp_enqueue_style( 'parent-style', $template_url.'/style.css' );

  // manually add image_uploader script and cloudinary, which will launch the cloudinary widget
  wp_register_script( 'cloudinary', 'https:////widget.cloudinary.com/global/all.js', null, null, true );
  wp_enqueue_script('cloudinary');
  wp_enqueue_script('image_uploader', $child_theme_url.'/javascript/cloudinary/image_uploader.js' );
}
