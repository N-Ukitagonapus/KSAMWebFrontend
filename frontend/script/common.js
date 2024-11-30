const apiInvokeURL="https://sgqsa573nc.execute-api.ap-northeast-1.amazonaws.com/dev";
const env = "TEST"
/**
 * リクエスト部品生成
 * @param raw JSONパラメータ
 * return リクエスト部品
 */
function createRequestOptions(method, env, paramjson){
  // instantiate a headers object
  var myHeaders = new Headers();
  // add content type header to object
  myHeaders.append("Content-Type", "application/json");
  // using built in JSON utility package turn object to string and store in a variable
  var raw = JSON.stringify({"method":method, "env":env, "param":paramjson});
  // create a JSON object with parameters for API call and store in a variable
  var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      cache: 'no-cache',
      body: raw,
      redirect: 'follow'
  };
  return requestOptions;
}

/**
 * トーストバリデーションクラス切り替え
 * @param targetid 対象ID
 * @param isOk 結果 true:OK false:NG
 */
function changeToastClass (target,isOk) {
  target.removeClass("text-bg-primary text-bg-danger").addClass(isOk ? "text-bg-primary" : "text-bg-danger");
}

/**
 * 日付をフォームから取得
 */
function getDateFromForm(value) {
  return new Date(Date.parse(value))
}

/**
 * 日付形式を文字列に変換
 */
function dateToString(date){
  return date.toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit", day: "2-digit"});
}

/**
 * 月初取得
 * @param inputDate 入力日付
 * return 月初日
 */
function getFirstDayOfMonth (inputDate) {
  var retDate = structuredClone(inputDate);
  retDate.setDate(1);
  return retDate;
}

/**
 * 月末取得
 * @param inputDate 入力日付
 * return 月末日
 */
function getLastDayOfMonth (inputDate) {
  var retDate = structuredClone(inputDate);
  retDate.setMonth(retDate.getMonth() + 1, 0);
  return retDate;
}


/////////////// バリデーション ///////////////
function addMessage(target, text){
  if(target.html().length == 0){
    target.html(text);
  } else {
    target.html(target.text() + "<br>" +text);
  }
}

function setValidated(target, msgdiv){
  target.removeClass("is-invalid").addClass("is-valid");
  msgdiv.html("");
}

function validateRequired (target, msgdiv, msg) {
  if (target.val().length == 0) {
    target.removeClass("is-valid").addClass("is-invalid");
    addMessage(msgdiv, msg);
    return false;
  }
  return true;
}

function validateRequired (target, msgdiv, msg) {
  if (target.val().length == 0) {
    target.removeClass("is-valid").addClass("is-invalid");
    addMessage(msgdiv, msg);
    return false;
  }
  return true;
}

function validateRegex (target, msgdiv, regex, msg) {
  if (!(target.val().match(regex))) {
    target.removeClass("is-valid").addClass("is-invalid");
    addMessage(msgdiv, msg);
    return false;
  }
  return true;
}

function validateConfirm (target, msgdiv, confirm, msg) {
  if (target.val() != confirm.val()) {
    target.removeClass("is-valid").addClass("is-invalid");
    addMessage(msgdiv, msg);
    return false;
  }
  return true;
}