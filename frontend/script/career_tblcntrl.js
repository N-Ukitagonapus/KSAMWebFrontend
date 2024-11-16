const testdata= [
  {
    "term_start":"2020/01/01",
    "term_end":"2020/05/31",
    "gyoshu":"小売",
    "project_desc":"○○商社の在庫管理システム"
  },
  {
    "term_start":"2020/06/01",
    "term_end":"2020/07/31",
    "gyoshu":"金融",
    "project_desc":"××銀行の全銀連携"
  },
  {
    "term_start":"2020/08/01",
    "term_end":"2024/10/31",
    "gyoshu":"不動産",
    "project_desc":"マンション契約者向けWebサービス"
  }
]
var jsondata;
var table;
const BUTTON_EDIT = '<button type="button" class="btn btn-primary btn-edit"><span></span>編集</button>';
const BUTTON_DELETE = '<button type="button" class="btn btn-danger btn-delete"><span></span>削除</button>';
$(function(){

  jsondata = testdata;
  drawtable();

  function drawtable(){
    var newjson = [];
    for (var item in jsondata) {
      parsed = jsondata[item];
      newitem = {};
      newitem.row = Number(item)+ 1;
      newitem.term = parsed.term_start + " ～ " + parsed.term_end;
      newitem.gyoshu = parsed.gyoshu;
      newitem.project_desc = parsed.project_desc;
      newjson.push(newitem);
    }

    table = $("#careerTable").DataTable({
        data: newjson,
        columns: [
            { data: 'row'},
            { data: 'term'},
            { data: 'gyoshu' },
            { data: 'project_desc' },
            { data: null }
          ],
          columnDefs: [
            {
                data: null,
                defaultContent: BUTTON_EDIT + ' ' + BUTTON_DELETE,
                targets: -1
            }
          ],
          destroy: true,
          sort: false,
          info: false,
          paging: false,
          searching: false,
    });
    $('.btn-edit').each(function () {
      $(this).on('click', function(evt){
        $this = $(this);
        var rownum = parseInt($this.parents('tr')[0].cells[0].innerText);
        openModal(rownum,jsondata[rownum - 1]);
      })
    });
    if(jsondata.length > 1) {
      $('.btn-delete').each(function () {
        $(this).on('click', function(){
          $this = $(this);
          var rownum = parseInt($this.parents('tr')[0].cells[0].innerText);
          if(confirm(rownum + "行目のデータを消しますか？")){
            if(confirm("本当に削除してもよろしいですね？\n(データ保存すると、削除したデータは戻せません！)")){
              jsondata = filterData(jsondata, rownum - 1);
              drawtable(jsondata);
            }
          }
        })
      });
    } else {
      $('.btn-delete').prop("disabled", true);
    }
  }

  $('#btnAddRow').on('click', function(){
    newData = {};
    today = new Date();
    newData.term_start = dateToString(today);
    newData.term_end = dateToString(getLastDayOfMonth(today));
    newData.gyoshu = "NEW";
    newData.project_desc = "新規作成";
    jsondata.push(newData);
    drawtable(jsondata);
  })

  //編集モーダルを開く
  function openModal(row,data){
    $('#modal_editCareer').modal('show');
    setDataToForm(data);
    $('#btn_cancelEdit').off('click');
    $('#btn_updateRow').off('click');
    $('#btn_cancelEdit').on('click', function(){
      if(confirm("キャンセルしてもよろしいですか？")){
        $('#modal_editCareer').modal('hide');
      }
    })
    $('#btn_updateRow').on('click', function(){
      $('#modal_editCareer').modal('hide');
    })
  }

  function setDataToForm(data) {
    setFormValue($('#frm_term_start'), data.term_start);
    setFormValue($('#frm_term_end'), data.term_end);
    setFormValue($('#frm_gyoshu'), data.gyoshu);
    setFormValue($('#frm_project_desc'), data.project_desc);
  }

  //値設定
  function setFormValue(target, value){
    if (value !== undefined) {
      target.val(value);
    }
  }

  //データ削除
  function filterData(oldJson, row) {
    var newData = oldJson.filter(function(item, index){
      if (index != row) return true;
    });
    return newData;
  }

})
