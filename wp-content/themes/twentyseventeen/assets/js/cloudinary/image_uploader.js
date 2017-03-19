jQuery(document).ready(function($) {
  console.log('Image uploader loading');
  jQuery('#upload_widget_opener').cloudinary_upload_widget(
    console.log('click registered');
    { cloud_name: 'demo', upload_preset: 'a5vxnzbp',
      cropping: 'server', folder: 'user_photos' },
    function(error, result) { console.log(error, result) });
})
