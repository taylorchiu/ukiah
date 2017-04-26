jQuery(document).ready(function(){

  listenForInputClick();


  function listenForInputClick(){
    jQuery("input:text, textarea").focus(function(e){
      toggleInput(e.target);
    });

    jQuery("input:text, textarea").focusout(function(e){
      toggleInput(e.target);
    })
  }

  function toggleInput(el){
    var placeholder = jQuery(el).attr('placeholder');
    if(placeholder){
      jQuery(el).attr('data-placeholder', placeholder);
      jQuery(el).attr('placeholder', '');
    }else{
      jQuery(el).attr('placeholder', jQuery(el).attr('data-placeholder'));
    }
    jQuery(el).closest('li').toggleClass('hidden_label');
  }

});
