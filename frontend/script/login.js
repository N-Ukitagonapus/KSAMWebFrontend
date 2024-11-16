

const ACCESS_OK = 200
$(function(){
  $("#toast").toast({delay: 5000, autohide: true});
  $('#btnLogin').on('click', function(){
    loginid = $("#login_id").val();
    password= $("#password").val();

    var requestOptions = createRequestOptions(JSON.stringify({"method":"login", "login_id":loginid,"pass_word":password}));

    fetch(apiInvokeURL, requestOptions)
        .then(response => response.text())
        .then(result => {
            body= JSON.parse(JSON.parse(result).body)
            if (body.login_result.code == ACCESS_OK) {
                form = $("#form");
                form.method = 'POST';
                form.action = 'main.html';
                form.submit();
            } else if(loginid == "test" && password == "test"){
                form = document.getElementById("#form");
                form.method = 'POST';
                form.action = 'main.html';
                form.submit();
            } else {
                showtoast("ログインIDかパスワードが違います。","デモ版では両方「test」でログインできます。");
            }
        })
        .catch(error => {
            console.log('error', error)
            showtoast("サーバでエラーが発生しました。","コンソールログの内容をお確かめの上、管理者にお問い合わせください。");
        });
    })

    function showtoast(hdMsg, bdMsg){
        $('#toast_hd').text(hdMsg);
        $('#toast_msg').text(bdMsg);
        $('#toast').toast("show");
    }

    // var get_member = (loginid)=>{
    //     // instantiate a headers object
    //     var myHeaders = new Headers();
    //     // add content type header to object
    //     myHeaders.append("Content-Type", "application/json");
    //     // using built in JSON utility package turn object to string and store in a variable
    //     var raw = JSON.stringify({method:"get_member", body:{"login_id":loginid}});
    //     // create a JSON object with parameters for API call and store in a variable
    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };
    //     // make API call with parameters and use promises to get response
    //     fetch(apiInvokeURL, requestOptions)
    //     .then(response => response.text())
    //     .then(result => alert(JSON.parse(result).body))
    //     .catch(error => console.log('error', error));
    // }
})