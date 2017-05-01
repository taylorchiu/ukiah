jQuery(document).ready(function($) {
  var imageDetailString;
  IMAGE_DETAILS = {};

  mountUploader(jQuery('.custom-form__add_new_image.empty'));
  listenForCloudinarySuccess();
  listenForDetailsClick();
  setDropdownOptions();
  listenForFormChange();
  listenForSubmit();
  listenForDelete();

  function listenForDetailsClick() {
    jQuery('.edit-details-button').click(function(){
      toggleImageDetails(this);
      closeOtherDetails(this);
    });
  }

  function toggleImageDetails(button) {
    var form = jQuery(button).siblings('.image-details__form');
    var buttonText = jQuery(button).text();
    var detailsText = jQuery(button).siblings('.image-details__text');
    if(buttonText == 'edit details'){
      jQuery(button).text('close details');
    }else if(buttonText == 'close details'){
      jQuery(button).text('edit details');
    }
    jQuery(button).toggleClass('open');
    detailsText.toggle();
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
        button_caption: '+ Add image',
        button_class: 'cloudinary-button-overrides',
        show_powered_by: false,
        sources: ['local'],
        stylesheet: 'http://localhost:8888/wp-content/themes/enfold-child/css/uploader_widget.css',
        thumbnails: '.custom-form__image',
        thumbnail_transformation: {width: 400, height: 300, crop: 'limit'},
       },
      function(error, result) { console.log(error, result) }
    );
  }

  function listenForCloudinarySuccess() {
    jQuery(document).on('cloudinarywidgetsuccess', function(e, data) {
      var image = {
        publicId: data[0].public_id.replace('print_requests/', ''),
        filename: data[0].original_filename.replace(' ', '_') + "." + data[0].format,
        url: data[0].secure_url,
        deleteToken: data[0].delete_token,
      };
      updateAndSetValues(image.publicId, image);

      var imageSection = jQuery('.custom-form__add_new_image.empty');
      var imageDetails = imageSection.find('.image-details');
      cloneAddNewImageSection(imageSection);

      // set publicId and original-filename data attributes
      imageDetails.attr('data-image-id', image.publicId);
      imageDetails.attr('data-original-filename', image.filename);
      imageDetails.attr('data-url', image.url);
      // replace header with filename
      var imageDetailsSection = jQuery(".image-details[data-image-id*=" + image.publicId + "]")
      imageDetailsSection.find('.image-filename').text(image.filename);
      imageDetailsSection.find('.edit-details-button').toggle();
      imageSection.find('.delete-image-button').delay(1000).fadeToggle();
      // hide cloudinary delete button on thumbnail
      jQuery('.cloudinary-delete').hide();
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
    clone.find('.cloudinary-thumbnails').remove();
    clone.find('.delete-image-button').hide();
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
    jQuery('.image-details-select').change(function(el) {
      buildDetailsObject(el);
    })
  }

  function buildDetailsObject(el) {
    var field = el.target.id;
    var value = el.target.value;
    var data = {
      publicId: jQuery(jQuery(el.target).closest('.image-details')[0]).attr('data-image-id')
    };
    data[field] = value;
    updateAndSetValues(data.publicId, data);
  }

  function updateAndSetValues(publicId, data) {
    updateImageDetails(publicId, data);
    setHiddenField();
    setDetailText(publicId);
  }

  function updateImageDetails(publicId, data) {
    IMAGE_DETAILS[publicId] = IMAGE_DETAILS[publicId] || {};
    jQuery.each(data, function(key, value) {
      IMAGE_DETAILS[publicId][key] = IMAGE_DETAILS[publicId][key] || value;
    });
    return IMAGE_DETAILS;
  }

  function titleize(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function buildString() {
    var allImageDetails = [];
    jQuery.each(IMAGE_DETAILS, function(publicId, detailsObj) {
      var detailString = [];
      detailString.push("=========================");
      detailString.push("Cloudinary Image ID: " + publicId);
      detailString.push("Cloudinary URL: " + detailsObj.url);
      jQuery.each(detailsObj, function(key, val){
        // only show the relevant keys to the user
        switch(key){
          case 'paper':
          case 'quantity':
          case 'size':
          case 'border':
            key = titleize(key);
            detailString.push(key + ": " + val + ", ");
            break;
          default:
            break;
        }
      });
      detailString.push("=========================\n");
      allImageDetails.push(detailString.join("\n"));
    })
    return allImageDetails.join("\n");
  }

  function setHiddenField() {
    var inputId = jQuery("label:contains('Image Details')").attr('for');
    var imageDetails = buildString();
    jQuery("#" + inputId).val(imageDetails);
  }

  function setDetailText(publicId) {
    var imageDetails = jQuery(".image-details[data-image-id='" + publicId + "']")[0];
    var detailsText = jQuery(imageDetails).find('.image-details__text')[0];
    var spans = jQuery();
    jQuery.map(IMAGE_DETAILS[publicId], function(value, key){
      switch(key){
        case 'paper':
        case 'quantity':
        case 'size':
        case 'border':
          var text = titleize(key) + ": " + value;
          spans = spans.add(jQuery('<span />').addClass('image-details__text-line').html(text));
          break;
        default:
          break;
      }

    });
    jQuery(detailsText).empty().append(spans);
  }

  function removeImage(publicId) {
    delete IMAGE_DETAILS[publicId];
    setHiddenField();
    setDetailText(publicId);
  }

  function listenForDelete() {
    jQuery('.delete-image-button').click(function(e){
      if(confirm('Are you sure you want to delete this image?')){
        var publicId = jQuery(e.target).parents('.custom-form__image-container')
                                       .siblings('.image-details')
                                       .attr('data-image-id')
        removeImage(publicId);
        deleteCloudinary(e.target);
        jQuery(e.target).parents('.custom-form__section').remove();
      };
    })
  }

  function deleteCloudinary(el){
    var cloudinaryButton = jQuery(el).siblings('.cloudinary-thumbnails').find('.cloudinary-delete');
    jQuery(cloudinaryButton).click();
    jQuery(cloudinaryButton).parents('ul').remove();
  }

  function listenForSubmit() {
    jQuery('#gform_1 input[type=submit]').click(function () {
      jQuery('.entry-content-wrapper').children().slice(0,2).hide();
    });
  }

});
