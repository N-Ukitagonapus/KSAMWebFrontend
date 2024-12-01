const ACCESS_OK = 200

$(function(){
    $("#toast").toast({delay: 5000, autohide: true});
    $('#btnLogin').on('click', function(){
        if(checkValidation()){
        loginid = $("#login_id").val();
        password= $("#password").val();
        parameters ={"login_id":loginid,"pass_word":password}
        var requestOptions = createRequestOptions("login", env, parameters);
        fetch(lambdaInvokeURL, requestOptions)
            .then(response => response.text())
            .then(result => {
                lmdres = JSON.parse(JSON.parse(result).body).login_result
                if (lmdres.code == ACCESS_OK) {
                    sessionStorage.setItem('user_id', loginid);
                    form = $("#form");
                    form.attr("method", "POST");
                    form.attr("action",lmdres.url);
                    form.submit();
                } else {
                    showtoast("ログインに失敗しました。",lmdres.message);
                }
            })
            .catch(error => {
                console.log('error', error)
                showtoast("サーバでエラーが発生しました。","コンソールログの内容をお確かめの上、管理者にお問い合わせください。");
            });
        }
    })
    function checkValidation(){
        var result = true;
        if(validateRequired($('#login_id'), $('#msg_login_id'), "ログインIDを入力してください。")){
          setValidated($('#login_id'), $('#msg_login_id'));
        } else {
          result = false;
        }
        if(validateRequired($('#password'), $('#msg_password'), "パスワードを入力してください。")){
          setValidated($('#password'), $('#msg_password'));
        } else {
          result = false;
        }
        return result;
    }

    function showtoast(hdMsg, bdMsg){
        $('#toast_hd').text(hdMsg);
        $('#toast_msg').text(bdMsg);
        $('#toast').toast("show");
    }
})