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
    if(buttonText == '+ details'){
      jQuery(button).text('- hide details');
    }else if(buttonText == '- hide details'){
      jQuery(button).text('+ details');
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
        thumbnail_transformation: {width: 160, height: 120, crop: 'limit'},
       },
      function(error, result) { console.log(error, result) }
    );
  }

  function listenForCloudinarySuccess() {
    jQuery(document).on('cloudinarywidgetsuccess', function(e, data) {
      var publicId = data[0].public_id.replace('print_requests/', '');
      var filename = data[0].original_filename.replace(' ', '_') + "." + data[0].format;
      var imgUrl = data[0].secure_url;
      var imageSection = jQuery('.custom-form__add_new_image.empty');
      var imageDetails = imageSection.find('.image-details');
      cloneAddNewImageSection(imageSection, publicId);
      // set publicId and original-filename data attributes
      imageDetails.attr('data-image-id', publicId);
      imageDetails.attr('data-original-filename', filename);
      imageDetails.attr('data-url', imgUrl);
      // replace header with filename
      var imageDetailsSection = jQuery(".image-details[data-image-id*=" + publicId + "]")
      imageDetailsSection.find('.image-filename').text(filename);
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
    jQuery('.image-details-select').change(function(el) {
      buildDetailsObject(el);
    })
  }

  function buildDetailsObject(el) {
    var field = el.target.id;
    var value = el.target.value;
    var publicId = jQuery(jQuery(el.target).closest('.image-details')[0]).attr('data-image-id');
    var filename = jQuery(jQuery(el.target).closest('.image-details')[0]).attr('data-original-filename');
    var imgUrl = jQuery(jQuery(el.target).closest('.image-details')[0]).attr('data-url');
    updateImageDetails(publicId, filename, field, value, imgUrl);
  }

  function updateImageDetails(publicId, filename, field, value, imgUrl) {
    IMAGE_DETAILS[publicId] = IMAGE_DETAILS[publicId] || {};
    IMAGE_DETAILS[publicId].filename = filename;
    IMAGE_DETAILS[publicId][field] = value;
    IMAGE_DETAILS[publicId].url = imgUrl;
    setHiddenField();
    setDetailText(publicId);
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
      delete detailsObj.url;
      jQuery.each(detailsObj, function(key, val){
        key = titleize(key);
        detailString.push(key + ": " + val + ", ");
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
      if(key == 'filename'){
        return;
      }
      var text = titleize(key) + ": " + value;
      spans = spans.add(jQuery('<span />').addClass('image-details__text-line').html(text));
    });
    jQuery(detailsText).empty().append(spans);
  }

  function listenForDelete() {
    jQuery('.delete-image-button').click(function(e){
      // remove the image from IMAGE_DETAILS
      // call the cloudinary delete method
      alert('clicked');
    })
  }

  function listenForSubmit() {
    jQuery('#gform_1 input[type=submit]').click(function () {
      jQuery('.entry-content-wrapper').children().slice(0,2).hide();
    });
  }

});
