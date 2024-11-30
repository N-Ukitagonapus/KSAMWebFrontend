
const apiInvokeURL="https://sgqsa573nc.execute-api.ap-northeast-1.amazonaws.com/dev";
const ACCESS_OK = 200
const TOOMUCH_USAGE = 429
$(function(){
  テスト用
  $('#shodo_sosiki').val("n-ukita");
  $('#shodo_project').val("api-connection");
  $('#shodo_token').val("c52db2ea13f6840b63e4c783e6e86b7ba1bc1b9f");
  $('#chatwork_token').val("8fdddafd8e7fe15069fc8a94e59d33f8");
  
  $('#shodo_check').on('click', function(){
    switchShodoCheck(true);
    param = {
      "org_name":$('#shodo_sosiki').val(),
      "project_name":$('#shodo_project').val(),
      "token": $('#shodo_token').val()
    };
    var requestOptions = createRequestOptions("check_shodo", "env", param);
    fetch(apiInvokeURL, requestOptions)
    .then(response => response.text())
    .then(result => {
      var isAvailable = false;
      parsed = JSON.parse(result);
      parsedBody = JSON.parse(parsed.body);

      $('#shodo_connect_result').val(parsed.statusCode + " : " + parsedBody.msg);

      if (parsed.statusCode == ACCESS_OK) {
        isAvailable = parsedBody.check_result;
        $('#shodo_count_limit').val(parsedBody.limit);
        $('#shodo_count_usage').val(parsedBody.usage);
        $('#shodo_total_result').val(isAvailable ? "OK":"NG");
        $('#use_emend').attr('disabled', !isAvailable);
      } else {
        $('#shodo_total_result').val("NG");
        $('#use_emend').prop('checked', false);
        $('#use_emend').attr('disabled', true);
      }
      $('#modal_shodoresult').modal('show');
      switchShodoCheck(false);
    })
    .catch(error => {
      $('#shodo_connect_result').val(error);
      $('#shodo_total_result').val("NG");
      $('#use_emend').prop('checked', false);
      $('#use_emend').attr('disabled', true);
      $('#modal_shodoresult').modal('show');
      switchShodoCheck(false);
    })
  })
  $('#modal_shodoresult').on('shown.bs.modal', function () {
    $('#close_shodomodal').on('click', function(){
      $('#modal_shodoresult').modal('hide');
    })
  })

  $('#cw_check').on('click', function(){
    switchCWCheck(true);
    var requestOptions = createRequestOptions("check_cw",env,{"cw_token": $('#chatwork_token').val()});
    fetch(apiInvokeURL, requestOptions)
    .then(response => response.text())
    .then(result => {
      var isAvailable = false;
      parsed = JSON.parse(result);
      parsedBody = JSON.parse(parsed.body);
      if (parsed.statusCode == ACCESS_OK) {
        $('#chatwork_connect_result').val(parsedBody.response_code + " - " + parsedBody.msg);
        if(parsedBody.response_code == ACCESS_OK || parsedBody.response_code == TOOMUCH_USAGE) {
          $('#chatwork_connect_detail').val(parsedBody.detail)
        }
        $('#chatwork_result').val(parsedBody.response_code == ACCESS_OK ? "OK":"NG");
      } else {
        $('#chatwork_connect_result').val("API送信時にエラーが発生しました。");
        $('#chatwork_result').val("NG");
      }
      $('#modal_cwresult').modal('show');
      switchCWCheck(false);
    })
    .catch(error => {
      $('#chatwork_connect_result').val(error);
      $('#chatwork_result').val("NG");
      $('#modal_cwresult').modal('show');
      switchCWCheck(false);
    })
  })
  $('#modal_cwresult').on('shown.bs.modal', function () {
    $('#close_cwmodal').on('click', function(){
      $('#modal_cwresult').modal('hide');
    })
  })
})

function switchShodoCheck(loading){
  $('#spinner_checkshodo').attr("hidden",loading ? false : true);
  $('#shodo_check').prop("disabled",loading ? true: false);
  $('#shodo_result').val(loading ? "チェック中…" : $('#shodo_total_result').val());
}

function switchCWCheck(loading){
  result_text = $('#chatwork_result').val();
  $('#spinner_checkcw').attr("hidden",loading ? false : true);
  $('#cw_check').prop("disabled",loading ? true: false);
  $('#chatwork_result').val(loading ? "チェック中…" : result_text);
}
