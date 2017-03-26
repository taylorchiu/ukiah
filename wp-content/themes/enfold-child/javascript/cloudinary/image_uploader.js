jQuery(document).ready(function($) {
  var imageDetailString;

  // TO DO: set dropdown options from hidden fields!!

  mountUploader(jQuery('.custom-form__add_new_image.empty'));

  function mountUploader(newImageContainer) {
    jQuery(newImageContainer).find('#upload_widget_opener').cloudinary_upload_widget(
      { cloud_name: 'lightsource',
        upload_preset: 'ztbxelcz',
        cropping: null,
        folder: 'test',
        button_caption: 'Add New Image',
        button_class: 'cloudinary-button-overrides',
        show_powered_by: false,
        sources: ['local'],
        stylesheet: 'http://localhost:8888/wp-content/themes/enfold-child/css/uploader_widget.css',
        thumbnails: '#current_image',
       },
      function(error, result) { console.log(error, result) }
    );
  }

  jQuery(document).on('cloudinarywidgetsuccess', function(e, data) {
    console.log("Single file success", e, data);
    var publicId = data[0].public_id.replace('print_requests/', '');
    cloneAddNewImageSection(publicId);
    var filename = data[0].original_filename.replace(' ', '_') + "." + data[0].format;
    jQuery('#' + publicId).find('.image-filename').text(filename);
  });


  jQuery('.edit-details-button').click(function(){
    jQuery('.image-details__form').toggle();
  });

  jQuery('.image-details-input').focus(function(){
    if(jQuery(this).val()){
      jQuery(jQuery('.edit-details-button')[0]).html('+ Edit detailsf');
    };
  })


  // get image details before submit
 // this will have to hook into the GravityForms submit
  jQuery('#button').click(function(){
    var details = getImageDetails();
    imageDetailString = formatImageDetailString(details);
    setImageDetails(imageDetailString);
  });

  function cloneAddNewImageSection(imageId) {
    var current = jQuery('.custom-form__add_new_image.empty');
    var clone = current.clone();
    current.removeClass('custom-form__add_new_image empty')
      .addClass('custom-form__section')
      .attr('id', imageId);
    clone.find('#current_image').attr('id', '');
    clone.appendTo(jQuery('.custom-form'));
    clone.find('.image-filename').text('Filename');
    clone.find('.cloudinary-button-overrides').remove();
    mountUploader(clone);

    current.find('.cloudinary-button-overrides').remove();
    current.find('#upload_widget_opener').remove();
    current.find('#current_image').attr('id','');
    clone.find('.custom-form__image').attr('id','current_image');
  }

  function getImageDetails(imageId) {
    var details = {};
    jQuery(".image-details-input #"  + imageId).each(function(){
      details[this.id] = this.value;
    });
    console.log(details);
    return details;
  }


  function setInputVal(imageId, field, value) {
    // hidden fields are assigned a label with convention [field]_[imageId]
    // for example, Quantity for Image 1 is quantity_1
    var labelText = field + "_" + imageId
    var inputId = jQuery("label:contains(" + labelText + ")").attr('for');
    jQuery("#" + inputId).val(value);
  }

  function setImageDetails() {
    // assign image details to hidden fields per GF markup
      // TO DO: each image should have a more specific class
    var imageQuantity = jQuery.find('.cloudinary-thumbnails').length;
    var imageId;
    imageQuantity.forEach(function(img, index) {
      imageId = jQuery(img).attr('id');
      var imageDetails = getImageDetails(imageId);
      imageDetails.each(function(key, val) {
        setInputVal(imageId, key, val);
      });
    });
  }
});


// function formatImageDetailString(details) {
//   var string = "ImageID [filename]: ";
//   jQuery.each(details, function(key, val){
//     if(val){
//       string = string.concat(key + ": " + val + ", ");
//     }else{
//       string = string.concat(key + ": n/a, ");
//     }
//   });
//   console.log(string);
//   return string;
// }
