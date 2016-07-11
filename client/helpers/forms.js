formFeedbackInputClass = function(selectorStr, isOk) {

    var hasClass = false;

    if (isOk === true) {
      hasClass = 'success';
    } else if (isOk === false) {
      hasClass = 'error';
    } else {
      hasClass = 'warning';
    };

    var cssClass = selectorStr + ' form-group ';
    cssClass += hasClass ? 'has-feedback has-' + hasClass : '';

    $('.' + selectorStr).attr('class', cssClass);

};

formFeedbackMessage = function(container, cssClass, message) {

  if (typeof cssClass === 'undefined') {
    $(container).hide().addClass('hidden');
  }

  var txt = '<div class="alert alert-'+cssClass+'" role="alert">';
  txt += message + '</div>';
  $(container).show().removeClass('hidden').html(txt);

};
