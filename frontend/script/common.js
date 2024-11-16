const apiInvokeURL="https://sgqsa573nc.execute-api.ap-northeast-1.amazonaws.com/dev";

/**
 * リクエスト部品生成
 * @param raw JSONパラメータ
 * return リクエスト部品
 */
function createRequestOptions(raw){
  // instantiate a headers object
  var myHeaders = new Headers();
  // add content type header to object
  myHeaders.append("Content-Type", "application/json");
  // using built in JSON utility package turn object to string and store in a variable
  var raw = raw;
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

function getDateFromForm(value) {
  return new Date(Date.parse(value))
}

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