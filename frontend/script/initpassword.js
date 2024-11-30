const pwRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!-/:-@[-`{-~])[a-zA-Z\d!-/:-@[-`{-~]{8,}$/;
const CODE_OK = 200

$(function(){
  $("#toast").toast({delay: 5000, autohide: true});
  $('#btn_save').on('click', function(){

    $('.form-control').each(function(i,elem){
      $(elem).removeClass("is-invalid is-valid");
    });

    $('.invalid-feedback').each(function(i,elem){
      $(elem).text("");
    });

    if(!checkValidation()){
      showToast("入力値に問題があります。<br>ご確認の上再度ご入力ください。", false);
    } else {
      switchSpinner(true);
      userId = sessionStorage.getItem('user_id');
      parameters ={"user_id":userId, "new_password":$('#new_password').val()}
      var requestOptions = createRequestOptions("chg_password", env, parameters);
      fetch(apiInvokeURL, requestOptions)
          .then(response => response.text())
          .then(result => {
            lmdres = JSON.parse(JSON.parse(result).body)
              if (lmdres.code == CODE_OK) {
                showToast("パスワードを初期化しました。<br>3秒後にメイン画面に移動します。", true);
                setTimeout(function(){
                  form = $("#form");
                  form.attr("method", "POST");
                  form.submit();
                }, 3000);
              } else {
                  switchSpinner(false);
                  showToast("パスワード初期化に失敗しました。<br>管理者にお問い合わせください。", false);
              }
          })
          .catch(error => {
              switchSpinner(false);
              console.log('error', error)
              showToast("サーバでエラーが発生しました。<br>コンソールログの内容をお確かめの上、管理者にお問い合わせください。", false);
          });
      }

  });

  function checkValidation(){
    var result = true;
    if(validateRequired($('#new_password'), $('#msg_new_password'), "新しいパスワードを入力してください")
      && validateRegex($('#new_password'), $('#msg_new_password'), pwRegex, "新しいパスワードは半角英数記号8文字以上で入力してください。<br>大文字、小文字、数字、記号をそれぞれ1文字以上含めてください。")){
      setValidated($('#new_password'), $('#msg_new_password'));
    } else {
      result = false;
    }
    if(validateRequired($('#confirm_password'), $('#msg_confirm_password'), "新しいパスワードを入力してください")
      && validateRegex($('#confirm_password'), $('#msg_confirm_password'), pwRegex, "新しいパスワードは半角英数記号8文字以上で入力してください。<br>大文字、小文字、数字、記号をそれぞれ1文字以上含めてください。")
      && validateConfirm($('#confirm_password'), $('#msg_confirm_password'), $('#new_password'), "パスワードが一致しません。")){
      setValidated($('#confirm_password'), $('#msg_confirm_password'));
    } else {
      result = false;
    }
    return result;
  }
  function showToast(bdMsg, isOk){
    changeToastClass($('#toast'), isOk);
    $('#toast_msg').html(bdMsg);
    $('#toast').toast("show");
  }

  function switchSpinner(loading){
    $('#spinner_btn').attr("hidden",loading ? false : true);
    $('#btn_save').prop("disabled",loading ? true: false);
  }
})