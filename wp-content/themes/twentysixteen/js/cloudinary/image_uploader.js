jQuery(document).ready(function($) {
  console.log('Image uploader loading');
  jQuery('#upload_widget_opener').cloudinary_upload_widget(
    { cloud_name: 'lightsource', upload_preset: 'ztbxelcz',
      cropping: 'server', folder: 'test', button_caption: 'Choose Images',
      button_class: 'cloudinary-button-overrides',
      stylesheet: 'http://localhost:8888/wp-content/themes/enfold/css/uploader_widget.css' },
    function(error, result) { console.log(error, result) });
})
