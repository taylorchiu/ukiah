jQuery(document).ready(function($) {
  var imageDetailString;
  IMAGE_DETAILS = {};

  mountUploader(jQuery('.upload_widget_section'));
  clearInputs();
  setDropdownOptions();
  listenForCloudinarySuccess();
  listenForDetailsClick();
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
      var inputId = jQuery("label:contains('" + dropdown.label + "')").attr('for');
      var options = jQuery('select#' + inputId + ' option');
      // first append a default option as a placeholder
      jQuery('select#' + dropdown.id).append(
        "<option value=''>" + titleize(dropdown.id) + "</option>"
      );
      jQuery(options).each(function(index, option) {
        jQuery('select#' + dropdown.id).append(jQuery(option));
      });
    })
  }

  function mountUploader(newImageContainer) {
    jQuery(newImageContainer).find('#upload_widget_opener').cloudinary_upload_widget(
      { cloud_name: 'lightsource',
        upload_preset: 'ztbxelcz',
        cropping: null,
        folder: 'test',
        button_caption: 'Click here to add your image',
        button_class: 'avia-button',
        show_powered_by: false,
        sources: ['local'],
        stylesheet: 'http://localhost:8888/wp-content/themes/enfold-child/css/uploader_widget.css',
        thumbnails: '.custom-form__image',
        thumbnail_transformation: {width: 400, height: 300, crop: 'limit'},
       },
      function(error, result) { console.log(error, result) }
    );
  }

  function getImageData(datum) {
    return {
      publicId: datum.public_id.replace('print_requests/', ''),
      filename: datum.original_filename.replace(' ', '_') + "." + datum.format,
      url: datum.secure_url,
      deleteToken: datum.delete_token,
    };
  }

  function listenForCloudinarySuccess() {
    jQuery(document).on('cloudinarywidgetsuccess', function(e, data) {
      var thumbnails = [];
      jQuery.each(data, function(index, datum) {
        var imageData = getImageData(datum);
        var imageSection = cloneImageSection();
        setDataAttributes(imageSection, imageData);
        if (index == 0) {
          thumbnails = getThumbnails(imageData);
        }
        appendThumbnail(thumbnails[index], index, imageData);
        toggleButtons(imageData.publicId);
        updateAndSetValues(imageData.publicId, imageData);
      });
    });
  }

  function getThumbnails(imageData) {
    // the thumbs will be mounted to the first image's section
    // grab all the images so we can move each one to its correct section
    var imageSection = findImageSection(imageData.publicId);
    return imageSection.find('.cloudinary-thumbnail').detach();
  }

  function appendThumbnail(thumb, index, imageData) {
      var imageSection = findImageSection(imageData.publicId);
      imageSection.find('.custom-form__image').append(thumb);
  }

  function cloneImageSection() {
    var imageSection = jQuery('.custom-form__add_new_image.empty');
    imageSection.find('.avia-button').remove();
    clearInputs(imageSection);
    var clone = imageSection.clone(true);
    imageSection.removeClass('custom-form__add_new_image empty')
                .addClass('custom-form__section');
    clone.appendTo(jQuery('.custom-form'));
    clone.find('.cloudinary-thumbnails').remove();
    imageSection.find('#upload_widget_opener').remove();
    return imageSection;
  }

  function clearInputs(imageSection = null) {
    var sections = imageSection || jQuery('.custom-form__section, .custom-form__add_new_image.empty')
    jQuery.each(sections, function(index, section){
      var inputs = jQuery(section).find('.image-details-input, .image-details-select');
      jQuery.each(inputs, function(index, input){ jQuery(input).val("") } );
    });
  }

  function setDataAttributes(imageSection, imageData) {
    imageSection.attr('data-image-id', imageData.publicId);
    var imageDetails = imageSection.find('.image-details');
    imageDetails.attr('data-image-id', imageData.publicId);
    imageDetails.attr('data-original-filename', imageData.filename);
    imageDetails.attr('data-url', imageData.url);
    // set header text
    imageDetails.find('.image-filename').text(imageData.filename);
  }

  function findImageDetailsSection(publicId) {
    return jQuery(".image-details[data-image-id*=" + publicId + "]")
  }

  function findImageSection(publicId) {
    return jQuery('.custom-form__section[data-image-id*=' + publicId + ']');
  }

  function toggleButtons(publicId) {
    var imageDetailsSection = findImageDetailsSection(publicId);
    var imageSection = findImageSection(publicId);
    imageDetailsSection.find('.edit-details-button').toggle();
    imageSection.find('.delete-image-button').delay(1000).fadeToggle();
    jQuery('.cloudinary-delete').hide();
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
    var imageDetailsSection = findImageDetailsSection(publicId);
    var detailsText = jQuery(imageDetailsSection).find('.image-details__text')[0];
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
