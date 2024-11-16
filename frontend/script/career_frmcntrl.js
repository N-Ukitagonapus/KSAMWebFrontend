$(function(){
  $("#toast").toast({delay: 5000, autohide: true});

  $('#btn_save').on('click', function(){
    $('#toast').toast("show");
  })

  $('#frm_term_start').datepicker({
    uiLibrary: 'bootstrap5',
    language:'ja',
    format: 'yyyy/mm/dd'
  });

  $('#frm_term_end').datepicker({
    uiLibrary: 'bootstrap5',
    language:'ja',
    format: 'yyyy/mm/dd'
  });

  $('#frm_term_start').change(function() {
    var nd = getFirstDayOfMonth(getDateFromForm($('#frm_term_start').val()));
    $('#frm_term_start').val(dateToString(nd));
  });

  $('#frm_term_end').change(function() {
    var nd = getLastDayOfMonth(getDateFromForm($('#frm_term_end').val()));
    $('#frm_term_end').val(dateToString(nd));
  });

  $('[name=position]').change(function() {
    var v = $('[name=position]').val();
    if (v == 'ETC') {
      $("#position_etc").attr('disabled', false);
    } else {
      $("#position_etc").val("");
      $("#position_etc").attr('disabled', true);
    }
  });

  $('#name_pg_etc1').change(function() {
    var v = $('#name_pg_etc1').val();
    if (v != '') {
      $("#amount_pg_etc1").attr('disabled', false);
    } else {
      $("#amount_pg_etc1").val("");
      $("#amount_pg_etc1").attr('disabled', true);
    }
  });

  $('#name_pg_etc2').change(function() {
    var v = $('#name_pg_etc2').val();
    if (v != '') {
      $("#amount_pg_etc2").attr('disabled', false);
    } else {
      $("#amount_pg_etc2").val("");
      $("#amount_pg_etc2").attr('disabled', true);
    }
  });
})