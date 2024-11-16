const pwRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,}$/;

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
      setTimeout(function(){
        switchSpinner(false);
        if($('#old_password').val() != "test"){
          showToast("パスワードが違います。<br>※現在のパスワードは「test」で入力してください。", false);
        } else {
          $('.form-control').each(function(i,elem){
            $(elem).removeClass("is-invalid is-valid");
            $(elem).val("");
          });
          showToast("パスワードを変更しました。", true);
        }
      }, 1000);
    }

  });

  function checkValidation(){
    var result = true;
    if(validateRequired($('#old_password'), $('#msg_old_password'), "パスワードを入力してください")){
      setValidated($('#old_password'), $('#msg_old_password'));
    } else {
      result = false;
    }
    if(validateRequired($('#new_password'), $('#msg_new_password'), "新しいパスワードを入力してください")
      && validateRegex($('#new_password'), $('#msg_new_password'), pwRegex, "新しいパスワードは半角英数字8文字以上で入力してください。<br>大文字、小文字、数字をそれぞれ1文字以上含めてください。")){
      setValidated($('#new_password'), $('#msg_new_password'));
    } else {
      result = false;
    }
    if(validateRequired($('#confirm_password'), $('#msg_confirm_password'), "新しいパスワードを入力してください")
      && validateRegex($('#confirm_password'), $('#msg_confirm_password'), pwRegex, "新しいパスワードは半角英数字8文字以上で入力してください。<br>大文字、小文字、数字をそれぞれ1文字以上含めてください。")
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