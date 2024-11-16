$(function(){
  $("#toast_success").toast({delay: 5000, autohide: true});
  $("#toast_failure").toast({delay: 5000, autohide: true});

  $('#btn_save').on('click', function(){
    $('#toast_success').toast("show");
  })

  $('#gyokai_start').datepicker({
    uiLibrary: 'bootstrap5',
    language:'ja',
    format: 'yyyy/mm/dd'
  });
  
  $('#gyokai_start').change(function() {
    var nd = getFirstDayOfMonth(getDateFromForm($('#gyokai_start').val()));
    $('#gyokai_start').val(dateToString(nd));
  });
})