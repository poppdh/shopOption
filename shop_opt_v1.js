// js
// 2019
// inday jin

$(function(){



  $('body').jShop({
    selectClass: '.js_opt_sel',
    // 셀렉트박스 클래스명
    selectReqClass: '.req',
    // 필수옵션 클래스명
    selectWrap: '.p',
    // 셀렉트박스 감싸는 엘리먼트 클래스명



    orginLngBtnClass: '.lng_btn',
    // 구매 수량 버튼 클래스명
    orginLngInpClass: '.lng_inp',
    // 구매 수량 입력 클래스명


    lengthBtnClass: '.opt_lng_btn',
    // 수량 버튼 클래스명
    lengthInpClass: '.opt_lng_inp',
    // 수량 입력 클래스명
    deleteBtnClass: '.js_opt_del',
    // 선택 옵션 삭제 버튼 클래스명

    optCanvasClass: '.append_opt',
    // 선택 옵션이 추가,삭제될 엘리먼트 클래스명
    optWrapClass: '.opt_wrap',
    // 옵션 전체 감싸는 엘리먼트 클래스명
    optAddWrapClass: '.li',
    // 추가 옵션이 감싸여있는 엘리먼트 클래스명

    inputHiddenClass: '.opt_hd',
    // 옵션 데이터를 가지고 있는 input:hidden 클래스명

    unitPriceClass: '.calc_unit_p',
    // 옵션 개당 가격이 출력되는 엘리먼트 클래스명
    totalPriceClass: '.total_price',
    // 총 합계 가격이 출력되는 엘리먼트 클래스명

    submitBtnClass: '.ord_submit_btn',
    // 주문하기 버튼 클래스명

    fakeSubmitClass: '.fake_submit_btn',
    // form 밖에서 form submit 할 클래스명
    cartBtnClass: '.ord_cart_btn',
    // 장바구니 버튼 클래스명
    ectSubmitClass: '.ord_asdf_btn',
    // 기타 데이터 연결할 버튼 클래스명
    formClass : '.ord_form',
    // form 클래스명 클래스명

    makeAppend: function(tit, pri, type){
      // 옵션 선택시 추가될 html code
      // tit 옵션명
      // pri 가격
      // type 옵션타입(세트필수, 단독필수, 추가);
      return(
      `<li class="li">
      <p class="opt_tit">${tit}</p>
        <div class="cb">
          <div class="calc_num_box fl">
            <button type="button" class="m opt_lng_btn bgi_a"></button>
            <input type="text" class="num_inp dotum opt_lng_inp btn calc_inp" name="sel_option01[]" value="1" maxlength="5">
            <button type="button" class="p opt_lng_btn bgi_a"></button>
            <button type="button" class="js_opt_del opt_del_btn"></button>
            <input type="hidden" name="sel01_oprice[]" value="${pri}">
            <input type="hidden" name="sel01_essential[]" value="${type}">
            <input type="hidden" name="sel01_oname[]" value="${tit}">
          </div>
          <div class="fr fz12 price_txt"><span class="calc_unit_p dib">${pri}</span>원</div>
        </div>
        </li>`
      )
    },



    ordCallback: function(e, form, url){
      // 구매하기 callback
      //form.submit(); 으로 데이터 전송가능

      form.attr('action', url);
      console.log('submit');
    },

    cartCallback: function(e, form, url){
      // 장바구니 callback
      //form.submit(); 으로 데이터 전송가능

      let data = form.serialize();
      let dataJson = null;
      $.ajax({
        type: 'post',
        url: url,
        data: data,
        success: function(data){
          try{
            dataJson = JSON.parse(data);
          }catch (e) {
            alert('Data error');
          }
          //code
        },statusCode:{
          404: function(){
            alert('Server Error');
          }
        }
      });
    },

    etcCallback: function(e, form, type){
      // 기타 callback
      // type으로 버튼 형식 확인 후 분할 사용 가능
      //form.submit(); 으로 데이터 전송가능

      console.log(type,'기타');
    }


  });








});
