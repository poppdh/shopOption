# Jquery 쇼핑몰 옵션선택, 구매, 장바구니

code
```
<input type="hidden" class="opt_hd" value='{
  "gid":"16109355565481",
  "memCheck":false,
  "optGroup":true,
  "initPrice":8500,
  "opt":{
    "req":[
      {
        "name": "규격",
        "price":[0,2420,2640,3080,3520,3850,4620]
      },
      {
        "name": "페인팅여부",
        "price":[0,0,550]
      },
      {
        "name": "페인팅여부",
        "price":[0,0,550]
      }
    ],
    "add":[
      {
        "name": "파이프캡",
        "price":[0,880,880,880]
      },
      {
        "name": "파이프캡",
        "price":[0,880,880,880]
      }
    ]
  }
}'>
```

* gid : 상품코드
* memOrder : 비회원주문 가능 여부()
* optGroup : 세트 필수 옵션 true, 단일 필수 옵션 false(bool)
* initPrice : 기본가(number)
* opt : 옵션(obj)
* req : 필수옵션 리스트 비어있으면 필수옵션 체크안함(arr)
* add : 추가옵션 리스트
*   name : 옵션 타이틀(string)
*   price : 옵션가 리스트(arr)


옵션 종류
* 세트 필수 옵션
* 단일 필수 옵션
* 추가 옵션

## 세트 필수 옵션
필수 옵션 select가 전체 선택되어 있을 경우 옵션 코드 생성

옵션시 가격은 기본가+선택옵션 가격

실제 적용 예) 운동화 구매시 색상, 사이즈



jquery 쇼핑몰 옵션선택, 구매하기 장바구니
