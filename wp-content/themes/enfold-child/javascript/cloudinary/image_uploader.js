jQuery(document).ready(function($) {
  jQuery('#upload_widget_opener').cloudinary_upload_widget(
    { cloud_name: 'lightsource', upload_preset: 'ztbxelcz',
      cropping: 'server', folder: 'test', button_caption: 'Add New Image',
      button_class: 'cloudinary-button-overrides',
      stylesheet: 'http://localhost:8888/wp-content/themes/enfold-child/css/uploader_widget.css' },
    function(error, result) { console.log(error, result) });
});
