const express = require("express");
const Goods = require("../schemas/goods"); // ../는 내 위치에서 더 위 app.js파일이 있는 곳
const Carts = require("../schemas/cart")
const router = express.Router();


// /api주소가 된다.
router.get("/", (req, res) => {
  res.send("this is root page");
});


// /api/goods 주소가 된다.
router.get("/goods", async (req, res) => {
  const {category} = req.query;

  console.log("category ? ",category);


  const goods = await Goods.find({category});
  res.json({
    goods, // goods:goods 와 동일한 코드. 객체 초기자라 불른다.
  });
});

router.get("/goods/cart", async (req, res)=>{
  const carts = await Carts.find();
  const goodsIds =carts.map((cart)=>cart.goodsId);
  const goods = await Goods.find({goodsId:goodsIds});

  res.json({
      cart : carts.map((cart)=>({
          quantity : cart.quantity,
          goods : goods.find((item)=>item.goodsId===cart.goodsId),
      })),
  });
});



// /goods/1234   :  1234가 goodsId가 된다.
// url에서 가져올 때는 문자열이다.
router.get("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params; //const goodsId = req.params.goodsId;

  //find함수는 하나를 찾는 함수가 아니라 다수가 있으면 다수를 찾는 함수이다. 그렇기에 배열로 리턴함
  // 또한 프로미스 함수이기 때문에 await와 async를 붙여야한다.
  const [goods] = await Goods.find({ goodsId: Number(goodsId) });

  // 비구조화(destructoring) - 배열, 객체 둘 다 가능
  //const [detail] = goods.filter((item) => item.goodsId === Number(goodsId));
  res.json({
    goods,   //객체초기화 사용   detail: detail,
  });
});




router.delete("/goods/:goodsId/cart", async (req, res)=>{
  const {goodsId}=req.params;

  const existsCarts= await Carts.find({goodsId : Number(goodsId)});
  if (existsCarts.length){
    await Carts.deleteOne({goodsId : Number(goodsId)});
  }

  res.json({success:true});
});


router.put("/goods/:goodsId/cart", async (req, res)=>{
  const {goodsId}=req.params;
  const {quantity}=req.body;
  
  const existsCarts = await Carts.find({goodsId:Number(goodsId)});
  if (quantity<1){
    res.status(400).json({success : false, errorMessage : "수량은 1 미만으로 설정할 수 없습니다."});
    return ;
  }

  if (!existsCarts.length){
    await Carts.create({goodsId : Number(goodsId), quantity});

  }
  else{
    await Carts.updateOne( {goodsId:Number(goodsId)} , {$set : {quantity}} );
  }
  
  res.json({success : true});
});



// HTTP메서드인 get을 통해 /books라는 resource들에 대해서 읽겠다, 얻겠다, 조회하겠다라는 의미
//res.json()은 응답으로 json형태의 데이터를 주겠다. HTTP에서는 Content-Type이라는 헤더를 통해 표현방법을 서술함.
router.get("/books", (req, res) => {
  res.json({ success: true, data: getAllBooks() });
});


// Get을 제외한 메서드는 req.body를 받아올 수 있다.
router.post("/goods", async (req, res) => {
  //const goodsId = req.body.goodsId; 이런식으로 쓰면 다른 파라퍼티값도 만들어줘야하므로 비구조화
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId }); //find함수는 프로미스를 반환함 그렇기에 await를 써준다.
  if (goods.length) {
    return res
      .status(400) //상태번호 400은 너 잘못되었다란 뜻.
      .json({ success: false, errorMessage: "이미 있는 데이터 입니다." }) 
  }

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price })
  res.json({ goods: createdGoods });

});





//라우터를 생성만 했고 아무것도 안했음. 이것을 모듈로 내보낼수 있어야한다.
// module.exports는 express 그대로 쓰는 약속이다.
module.exports = router;