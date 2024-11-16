$(function(){
  $("#toast").toast({delay: 5000, autohide: true});

  $('#btn_save').on('click', function(){
    $('#toast').toast("show");
  })

  $('.datepicker').datepicker({
    uiLibrary: 'bootstrap5',
    language:'ja',
    format: 'yyyy/mm/dd'
  });
})