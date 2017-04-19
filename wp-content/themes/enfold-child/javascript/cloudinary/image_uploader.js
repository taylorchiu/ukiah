jQuery(document).ready(function($) {
  var imageDetailString;
  IMAGE_DETAILS = {};

  mountUploader(jQuery('.custom-form__add_new_image.empty'));
  listenForCloudinarySuccess();
  listenForDetailsClick();
  setDropdownOptions();
  listenForFormChange();
  listenForSubmit();

  function listenForDetailsClick() {
    jQuery('.edit-details-button').click(function(){
      toggleImageDetails(this);
      closeOtherDetails(this);
    });
  }

  function toggleImageDetails(button) {
    var form = jQuery(button).siblings('.image-details__form');
    var text = jQuery(button).text();
    if(text == '+ details'){
      jQuery(button).text('- details');
    }else if(text == '- details'){
      jQuery(button).text('+ details');
    }
    jQuery(button).toggleClass('open');
    form.toggleClass('open').toggle();
  }

  function closeOtherDetails(button) {
    var otherButtons = jQuery('.edit-details-button.open').not(button);
    jQuery.each(otherButtons, function(index, el){
      toggleImageDetails(el);
    })
  }

  function setDropdownOptions() {
    // IMPORTANT: label must match the Gravity Forms field label!
    var dropdowns = [{ id: 'paper', label: 'paper_options' }, { id: 'border', label: 'border_options' }];
    dropdowns.forEach(function(dropdown) {
      // get input id
      var inputId = jQuery("label:contains('" + dropdown.label + "')").attr('for');
      var options = jQuery('select#' + inputId + ' option');
      jQuery(options).each(function(index, option) {
        // var option = new Option(option.val, option.val);
        jQuery('select#' + dropdown.id).append(jQuery(option));
      })
    })
  }

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

  function listenForCloudinarySuccess() {
    jQuery(document).on('cloudinarywidgetsuccess', function(e, data) {
      var publicId = data[0].public_id.replace('print_requests/', '');
      var filename = data[0].original_filename.replace(' ', '_') + "." + data[0].format;
      var imageSection = jQuery('.custom-form__add_new_image.empty');
      // set publicId and original-filename data attributes
      imageSection.find('.image-details').attr('data-image-id', publicId);
      imageSection.find('.image-details').attr('data-original-filename', filename);
      // replace header with filename
      var imageDetailsSection = jQuery(".image-details[data-image-id*=" + publicId + "]")
      imageDetailsSection.find('.image-filename').text(filename);
      cloneAddNewImageSection(imageSection, publicId);
      imageDetailsSection.find('.edit-details-button').toggle();
    });
  }

  function cloneAddNewImageSection(current) {
    var clone = current.clone(true);
    current.removeClass('custom-form__add_new_image empty')
           .addClass('custom-form__section');
    // prevent clone from interfering with thumbnail mounting
    clone.find('#current_image').attr('id', '');
    clone.appendTo(jQuery('.custom-form'));
    clone.find('.image-filename').text('Filename');
    clone.find('.cloudinary-button-overrides').remove();
    mountUploader(clone);

    // prep clone to be current_image
    current.find('.cloudinary-button-overrides').remove();
    current.find('#upload_widget_opener').remove();
    current.find('#current_image').attr('id','');
    clone.find('.custom-form__image').attr('id','current_image');
    jQuery.each(clone.find('image-details-input'), function(input){ jQuery(input).val("")});
  }

  function listenForFormChange() {
    jQuery('.image-details-input').change(function(el) {
      buildDetailsObject(el);
    });
  }

  function buildDetailsObject(el) {
    var field = el.target.id;
    var value = el.target.value;
    var publicId = jQuery(jQuery(el.target).closest('.image-details')[0]).attr('data-image-id');
    var filename = jQuery(jQuery(el.target).closest('.image-details')[0]).attr('data-original-filename');
    updateImageDetails(publicId, filename, field, value);
  }

  function updateImageDetails(publicId, filename, field, value) {
    IMAGE_DETAILS[publicId] = IMAGE_DETAILS[publicId] || {};
    IMAGE_DETAILS[publicId].filename = filename;
    IMAGE_DETAILS[publicId][field] = value;
    setHiddenField();
  }

  function buildString() {
    var images = [];
    jQuery.each(IMAGE_DETAILS, function(publicId, detailsObj) {
      var image = [];
      var imgUrl = cloudinary.image(publicId, {} );
      image.push("=========================");
      image.push("Cloudinary Image ID: " + publicId);
      image.push("Cloudinary Image URL: " + imgUrl);
      jQuery.each(detailsObj, function(key, val){
        key = key.charAt(0).toUpperCase() + key.slice(1);
        image.push(key + ": " + val + ", ");
      });
      image.push("=========================\n");
      images.push(image.join("\n"));
    })
    return images.join("\n");
  }

  function setHiddenField() {
    var inputId = jQuery("label:contains('Image Details')").attr('for');
    var imageDetails = buildString();
    jQuery("#" + inputId).val(imageDetails);
  }

  function listenForSubmit() {
    $('#gform_1 input[type=submit]').click(function () {
      handleSubmit();
    });
  }

  function handleSubmit() {
    jQuery('.custom-form').hide();
    // build cloudinary image URL for detail section?
    // submit image details to cloudinary metadata
  }

});
