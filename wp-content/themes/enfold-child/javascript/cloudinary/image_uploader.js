jQuery(document).ready(function($) {
  var imageDetailString;

  mountUploader(jQuery('.custom-form__add_new_image.empty'));
  listenForCloudinarySuccess();
  toggleImageDetails();
  setDropdownOptions();
  updateForm();

  function toggleImageDetails() {
    jQuery('.edit-details-button').click(function(){
      jQuery(this).siblings('.image-details__form').toggle();
      setDetailsButtonText(this);
      // send to hidden fields
    });
  }

  function setDetailsButtonText(button) {
    var text = jQuery(button).text();
    if(text == '+ Add details'){
      jQuery(button).text('- Hide details');
    }else if(text == '+ Edit details'){
      jQuery(button).text('- Hide details');
    }else if(text == '- Hide details'){
      // check if any inputs have contents
      var inputs = jQuery(button).siblings('.image-details__form').find('.image-details-input')
      inputs.each(function(index, el){
        if(jQuery(el).val()){
          jQuery(button).text('+ Edit details');
          return false;
        }else{
          jQuery(button).text('+ Add details');
        }
      })
    }
  }

  function setDropdownOptions() {
    var dropdowns = [{ id: 'paper', label: 'paper_' }, { id: 'border', label: 'border_' }];
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
      console.log("Single file success", e, data);
      var publicId = data[0].public_id.replace('print_requests/', '');
      cloneAddNewImageSection(publicId);
      var filename = data[0].original_filename.replace(' ', '_') + "." + data[0].format;
      jQuery(".image-details[data-image-id*=" + publicId + "]").find('.image-filename').text(filename);
    });
  }

  function cloneAddNewImageSection(imageId) {
    var current = jQuery('.custom-form__add_new_image.empty');
    var clone = current.clone(true);
    current.removeClass('custom-form__add_new_image empty')
      .addClass('custom-form__section')
      .attr('data-image-id', imageId);
    current.find('.image-details').attr('data-image-id', imageId);
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
  }

  // THIS DOESNT WORK BC IT RUNS AFTER SUBMIT
  // function onSubmit() {
  //   jQuery(document).bind('gform_post_render', function(){
  //     alert('gform_post_render');
  //     setImageDetails();
  //   });
  // }

  function updateForm() {
    // try to run this on focus lost in custom form section
    jQuery('.image-details-input').change(function() {
      setImageDetails();
    });
  }


  function getImageDetails(publicId) {
    // find the image-details section by publicId
    var imageDetailsSection = jQuery(".image-details[data-image-id*=" + publicId + "]");
    var inputs = jQuery(imageDetailsSection).find('input');
    var selects = jQuery(imageDetailsSection).find('select');
    var responses = jQuery.merge(inputs, selects);
    var details = {};
    // loop through each input, build the details hash
    jQuery.each(responses, function(index, el) {
      var inputId = jQuery(el).attr('id');
      details[inputId] = el.value;
    });
    console.log(details);
    return details;
  }

  function setInputVal(imageIndex, field, value) {
    // hidden fields are assigned a label with convention [field]_[imageId]
    // for example, Quantity for Image 1 has the label quantity_1
    var labelText = field + "_" + imageIndex;
    var inputId = jQuery("label:contains(" + labelText + ")").attr('for');
    jQuery("#" + inputId).val(value);
    console.log("setting value of" + value + "for: " + inputId);
  }

  function setImageDetails() {
    // assign image details to hidden fields per GF markup
    var imageSections = jQuery('.custom-form__section');
    var imageIndex;
    var publicId;
    jQuery.each(imageSections, function(index, section) {
      imageIndex = index;
      publicId = jQuery(section).attr('data-image-id');
      var imageDetails = getImageDetails(publicId);
      jQuery.each(imageDetails, function(index, val) {
        setInputVal(imageIndex, index, val);
      });
    });
  }
});
