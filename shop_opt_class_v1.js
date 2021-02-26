'use strict';

(function($){
  $.fn.jShop = function(jObj){

    // input:hidden value json형태로 변환
    let optHidV = null;
    const hiddenInp = $('.opt_hd');
    try{
      optHidV = JSON.parse(hiddenInp.val());
    }catch(e){}




    class ShopOpt{
      constructor(hdVal){
        this.select = $(jObj.selectClass);
        this.reqSelect = $(jObj.selectClass+jObj.selectReqClass);
        this.selWrap = jObj.selectWrap;

        this.orgLngBtn = jObj.orginLngBtnClass;
        this.orgLngInp = jObj.orginLngInpClass;
        this.orgLngVal = 1;

        this.lngBtn = jObj.lengthBtnClass;
        this.lnginp = jObj.lengthInpClass;
        this.delete = jObj.deleteBtnClass;

        this.canvas = $(jObj.optCanvasClass);
        this.wrap = $(jObj.optWrapClass);
        this.optAddWrap = jObj.optAddWrapClass;
        this.hdVal = optHidV;

        this.unitPrice = jObj.unitPriceClass;
        this.totalPrice = $(jObj.totalPriceClass);

        this.submitBtn = jObj.submitBtnClass;
        this.fakeSubmit = jObj.fakeSubmitClass;
        this.etcSbmBtn = jObj.ectSubmitClass;
        this.cartBtn = jObj.cartBtnClass;
        this.form = jObj.formClass;


        this.tempArr = []; //고유코드만 추가할 배열
        this.appendArr = []; // 추가된 옵션 객체 배열

        this.ordCallback = jObj.ordCallback;
        this.cartCallback = jObj.cartCallback;
        this.cartCallback = jObj.cartCallback;
        this.etcCallback = jObj.etcCallback;
        this.makeAppend = jObj.makeAppend;
      }

      // 가격 천단위 콤마 설정
      priceFormat(num){
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      // 가격 계산
      priceCalc(){
        const initPri = this.hdVal.initPrice;
        let calcPrice = 0;
        for(let key in this.appendArr){
          const that = this;
          if(this.appendArr[key].t === 'g'){
            calcPrice = calcPrice+(this.appendArr[key].p*this.appendArr[key].l);
            $(this.canvas).each(function(){
              const el = $(this);
              el.find(that.optAddWrap).eq(key).find(that.unitPrice).text(that.priceFormat(that.appendArr[key].p*that.appendArr[key].l));
            });

          }else{
            calcPrice = calcPrice+(this.appendArr[key].p*this.appendArr[key].l);
            $(this.canvas).each(function(){
              const el = $(this);
              el.find(that.optAddWrap).eq(key).find(that.unitPrice).text(that.priceFormat(that.appendArr[key].p*that.appendArr[key].l));
            })
          }
        }
        if(this.hdVal.opt.req.length === 0){
          calcPrice = calcPrice+(this.hdVal.initPrice*this.orgLngVal);
        }else{
        }
        this.totalPrice.text(this.priceFormat(calcPrice));

      }

      makeHtml(type, selObj, uniCode){
        let name = selObj.txt;

        let tit = null;
        let price = null;
        let typeNum = type === 'g' ? 0 : type === 'r' ? 1 : 2;
        let typeTxt = null;
        let optVal = null;

        if(type === 'g'){

          let nameSplit = selObj.txt.split('//');
          let priceSplit = selObj.Idx.optNum.split('_');
          nameSplit.splice(0,1);
          priceSplit.splice(0,1);
          for(let key in nameSplit){
            tit = tit === null ? this.hdVal.opt.req[key].name+':'+nameSplit[key] : tit+'<br/>'+this.hdVal.opt.req[key].name+':'+nameSplit[key];
            price = price === null ? this.hdVal.opt.req[key].price[priceSplit[key]] : price+this.hdVal.opt.req[key].price[priceSplit[key]];
          }

          optVal = tit;
          price = price+this.hdVal.initPrice;

        }else if(type === 'r'){
          tit = this.hdVal.opt.req[selObj.Idx.selNum].name;
          price = this.hdVal.initPrice + this.hdVal.opt.req[selObj.Idx.selNum].price[selObj.Idx.optNum];
          optVal = tit+ ':' +name;

        }else{
          tit = this.hdVal.opt.add[selObj.Idx.selNum].name;
          price = this.hdVal.opt.add[selObj.Idx.selNum].price[selObj.Idx.optNum];
          optVal = tit+ ':' +name;
        }
        this.appendArr.push({"t": type, "tit": tit+':'+name, "c": uniCode, "p":price, "l": 1});

        let appendCode = this.makeAppend(optVal, price, typeNum);
        this.canvas.append(appendCode);
        this.priceCalc();

      }

      selOverlapCheck($this, type, optIdx, txt){
        let selObj = {
          txt: txt,
          Idx: {"selNum": Number($this.attr('data-num')), "optNum": optIdx}
        }

        const pushCode = type === 'g' ? type+optIdx :type+'_'+selObj.Idx.selNum+'_'+selObj.Idx.optNum;

        // 중복 선택 확인
        if(this.tempArr.indexOf(pushCode) === -1){
          this.tempArr.push(pushCode);
          this.select.val(''); // 선택 완료 후 셀렉트박스 초기화
          this.makeHtml(type, selObj, pushCode);
        }else{
          alert('이미 선택된 옵션입니다.');
          $this.val('');
          return false;
        }
      }

      optMake($this){
        // 옵션 추가
        if($this.val() !== ''){
          let selTxt = '';
          const selIdx = $this.attr('data-n');
          let selOptIdx = $this.find('option:selected').index();
          const req = $this.hasClass('req') ? 'req' : '';
          const selWrap = this.selWrap;
          if(req === 'req'){
            if(this.hdVal.optGroup === true){
              // 세트 필수 옵션
              let groupIdx = '';
              let selGroupState = false;

              selOptIdx = '';
              this.wrap.find(this.reqSelect).each(function(){
                const el = $(this);
                if(el.val() !== ''){
                  selGroupState = true;
                  selOptIdx = selOptIdx+'_'+el.find('option:selected').index();
                  selTxt = selTxt+'//'+el.find('option:selected').text();
                }else{
                  selGroupState = false;
                  return false;
                }
              });

              if(selGroupState === true){
                this.selOverlapCheck($this, 'g', selOptIdx, selTxt);
              }else{
                return false;
              }
            }else{
              // 단일 필수 옵션
              selTxt = $this.find('option:selected').text();
              this.selOverlapCheck($this, 'r', selOptIdx, selTxt);
            }
          }else{
            // 추가 옵션
            selTxt = $this.find('option:selected').text();
            this.selOverlapCheck($this, 'a', selOptIdx, selTxt);
          }
        }else{}
      }

      optDelete($this){
        // 옵션 삭제
        const li = $this.closest(this.optAddWrap);
        const liIdx = li.index();
        this.tempArr.splice(liIdx, 1);
        this.appendArr.splice(liIdx, 1);
        const that = this;
        this.canvas.each(function(){
          const el = $(this);
          el.find(that.optAddWrap).eq(liIdx).remove();
        });
        this.priceCalc();
        return false;
      }

      optlngChange($this, inpEl, inpVal){
        const li = $this.closest(this.optAddWrap);
        const liIdx = li.index();

        this.appendArr[liIdx].l = inpVal;
        const that = this;
        this.canvas.each(function(){
          const el = $(this);
          el.find(that.optAddWrap).eq(liIdx).find(that.lnginp).val(inpVal);
        });
        this.priceCalc();
      }

      optLngBtn($this){
        const inpEl = $this.siblings(this.lnginp);
        let inpVal = inpEl.val();
        if($this.hasClass('m')){
          if(inpVal > 1){
            --inpVal;
          }
        }else{
          ++inpVal;
        }
        this.optlngChange($this, inpEl, inpVal);

      }

      optLngInp($this){
        $this.val($this.val().replace(/[^0-9]/g,""));
        let inpVal = $this.val();
        this.optlngChange($this, $this, inpVal);

      }


      ordlngInp($this){
        $this.val($this.val().replace(/[^0-9]/g,""));
        let inpVal = $this.val();
        this.orgLngVal = inpVal;

        o.priceCalc(inpVal);
      }

      ordlngBtn($this){
        const inp = $(o.orgLngInp);
        let inpVal = inp.val();
        if($this.hasClass('m')){
          if(inpVal > 1){
            --inpVal;
          }
        }else{
          ++inpVal;

        }
        inp.val(inpVal);
        this.orgLngVal = inpVal;

        o.priceCalc(inpVal);
      }


      submitInner(e, type){
        if(this.hdVal.memOrder === true){
          if(type === 'ord'){
            this.ordCallback(e, $(this.form), this.hdVal.ordUrl);
          }else if(type === 'cart'){
            this.cartCallback(e,$(this.form), this.hdVal.cartUrl);
          }else{
            this.etcCallback(e,$(this.form), type);
          }
        }else{
          //$(location).attr('href', this.hdVal.ordUrl);
        }
      }

      submit(e, type){
        if(this.hdVal.opt.req.length > 0){
          let reqState = false;
          for(let key in this.appendArr){
            if(this.appendArr[key].t === 'g' || this.appendArr[key].t === 'r'){
              reqState = true;
            }else{}
          }

          if(reqState){
            this.submitInner(e, type);

          }else{
            alert('옵션을 선택하지 않으셨습니다. 옵션을 선택해 주세요.');
            e.preventDefault();
            return false;
          }
        }else{
          this.submitInner(e, type);
        }
      }
    }

    const body = $('body');
    const o = new ShopOpt();

    // 옵션 선택
    $(o.select).change(function(){
      const $this = $(this);
      o.optMake($this);
      return false;
    });

    // 선택 옵션 삭제
    body.on('click', o.delete, function(){
      const $this = $(this);
      o.optDelete($this);
      return false;
    });

    // 옵션 수량 버튼
    body.on('click', o.lngBtn,function(){
      const $this = $(this);
      o.optLngBtn($this);
    });

    // 옵션 수량 입력
    body.on('keyup', o.lnginp, function(e){
      const $this = $(this);
      o.ordlngInp($this);
    });


    // 구매 수량 버튼
    body.on('click', o.orgLngBtn, function(){
      const $this = $(this);
      o.ordlngBtn($this);
    });

    // 구매 수량 입력
    body.on('keyup', o.orgLngInp, function(e){
      const $this = $(this);
      o.ordlngInp($this);
    });

    // Enter submit 방지
    body.on('keydown', o.lnginp+', '+ o.orgLngInp, function(e){
      if(e.keyCode === 13){
        e.preventDefault();
      }else{}
    });




    // 구매
    body.on('click', o.submitBtn, function(e){
      o.submit(e, 'ord');
    });

    // 장바구니
    body.on('click', o.cartBtn, function(e){
      o.submit(e, 'cart');
    });

    // 기타
    body.on('click', o.etcSbmBtn, function(e){
      const $this = $(this);
      o.submit(e, $this.attr('data-type'));
    });

    // form 밖에서 submit
    body.on('click', o.fakeSubmit, function(e){
      o.submit(e, 'ord');
    });




  }
})(jQuery);
