const ACCESS_OK = 200
const TOOMUCH_USAGE = 429
$(function(){
  $('[data-bs-toggle="popover"]').popover();
  $("#toast").toast({delay: 5000, autohide: true});
  init(sessionStorage.getItem('user_id'));

  $('.shodo_input').each(function() {
    $(this).change(function() {
      $('#use_emend').prop('checked', false);
      $('#use_emend').attr('disabled', true);
      $('#btn_save_shodo').attr('disabled', true);
    });
  });

  $('#chatwork_token').change(function() {
    $('#btn_save_cw').attr('disabled', true);
  });

  $('#shodo_check').on('click', function(){
    if(checkValidation_shodo) {
      switchShodoCheck(true);
      param = {
        "org_name":$('#shodo_sosiki').val(),
        "project_name":$('#shodo_project').val(),
        "token": $('#shodo_token').val()
      };
      var requestOptions = createRequestOptions("check_shodo", env, param);
      fetch(lambdaApiInvokeURL, requestOptions)
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
          $('#btn_save_shodo').attr('disabled', !isAvailable);
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
    }
  })
  $('#modal_shodoresult').on('shown.bs.modal', function () {
    $('#close_shodomodal').on('click', function(){
      $('#modal_shodoresult').modal('hide');
    })
  })

  $('#cw_check').on('click', function(){
    if(checkValidation_cw) {
      switchCWCheck(true);
      var requestOptions = createRequestOptions("check_cw",env,{"cw_token": $('#chatwork_token').val()});
      fetch(lambdaApiInvokeURL, requestOptions)
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
          $('#btn_save_cw').attr('disabled', parsedBody.response_code != ACCESS_OK);
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
    }
  })
  $('#modal_cwresult').on('shown.bs.modal', function () {
    $('#close_cwmodal').on('click', function(){
      $('#modal_cwresult').modal('hide');
    })
  })
  $('#btn_save_shodo').on('click', function(){
    if(checkValidation_shodo) {
      param = {
        "org_name":$('#shodo_sosiki').val(),
        "proj_name":$('#shodo_project').val(),
        "token": $('#shodo_token').val(),
        "use_flg": $('#use_emend').prop('checked'),
        "user_id": sessionStorage.getItem('user_id')
      };
      var requestOptions = createRequestOptions("save_shodo_util", env, param);
      fetch(lambdaInvokeURL, requestOptions)
      .then(response => response.text())
      .then(result => {
        statusCode=JSON.parse(result).statusCode;
        lmdres = JSON.parse(JSON.parse(result).body);
        isSuccess = statusCode == ACCESS_OK && lmdres.resultCode == ACCESS_OK;
        if (isSuccess) {
          showToast("Shodo設定を保存しました。",true);
        } else {
          showToast("Shodo設定を保存できませんでした。<br>管理者にお問い合わせください。",false);
        }
      })
      .catch(error => {
        showToast("保存中にエラーが発生しました。<br>管理者にお問い合わせください。",false);
      })
    }
  })

  $('#btn_save_cw').on('click', function(){
    if(checkValidation_cw) {
      param = {
        "cw_token":$('#chatwork_token').val(),
        "user_id": sessionStorage.getItem('user_id')
      };
      var requestOptions = createRequestOptions("save_cw_util", env, param);
      fetch(lambdaInvokeURL, requestOptions)
      .then(response => response.text())
      .then(result => {
        statusCode=JSON.parse(result).statusCode;
        lmdres = JSON.parse(JSON.parse(result).body);
        isSuccess = statusCode == ACCESS_OK && lmdres.resultCode == ACCESS_OK;
        if (isSuccess) {
          showToast("Chatwork設定を保存しました。",true);
        } else {
          showToast("Chatwork設定を保存できませんでした。<br>管理者にお問い合わせください。",false);
        }

      })
      .catch(error => {
        showToast("保存中にエラーが発生しました。<br>管理者にお問い合わせください。",false);
      })
    }
  })
  function init(user_id){
    param = {
      "user_id":user_id
    };
    var requestOptions = createRequestOptions("util_init", env, param);
    fetch(lambdaInvokeURL, requestOptions)
    .then(response => response.text())
    .then(result => {
      statusCode=JSON.parse(result).statusCode;
      lmdres = JSON.parse(JSON.parse(result).body);
      if (statusCode == ACCESS_OK && null != lmdres) {
        $('#shodo_sosiki').val(lmdres.shodo_org_name);
        $('#shodo_project').val(lmdres.shodo_proj_name);
        $('#shodo_token').val(lmdres.shodo_token);
        $('#chatwork_token').val(lmdres.chatwork_token);
        $('#use_emend').prop('checked', lmdres.use_shodo_flg);
        $('#use_emend').attr('disabled', false);
      }
    })
    .catch(error => {

    });
  }
})
function checkValidation_shodo(){
  var result = true;
  if(validateRequired($('#shodo_sosiki'), $('#msg_shodo_sosiki'), "組織名を入力してください。")){
    setValidated($('#shodo_sosiki'), $('#msg_shodo_sosiki'));
  } else {
    result = false;
  }
  if(validateRequired($('#shodo_project'), $('#msg_shodo_project'), "プロジェクト名を入力してください。")){
    setValidated($('#shodo_project'), $('#msg_shodo_project'));
  } else {
    result = false;
  }
  if(validateRequired($('#shodo_token'), $('#msg_shodo_token'), "トークンを入力してください。")){
    setValidated($('#shodo_token'), $('#msg_shodo_token'));
  } else {
    result = false;
  }
  return result;
}

function checkValidation_cw(){
  var result = true;
  if(validateRequired($('#chatwork_token'), $('#msg_chatwork_token'), "トークンを入力してください。")){
    setValidated($('#chatwork_token'), $('#msg_chatwork_token'));
  } else {
    result = false;
  }
  return result;
}
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

function showToast(bdMsg, isOk){
  changeToastClass($('#toast'), isOk);
  $('#toast_msg').html(bdMsg);
  $('#toast').toast("show");
}