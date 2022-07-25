// express 공식 사이트에 제약되어있는 사항. 프레임워크의 기본 룰
const express = require("express"); // express변수에 express패키지의 파일들을 불러오겠다.
const app = express(); // express의 서버 객체를 app변수에 받아온다.
const port =3000;


//mongoDB js 연결
const connect = require("./schemas"); //index라는 파일 이름은 생략 가능하다. ./shcemas/index
connect();



// ./는 상대경로. 내 경로에서부터 찾는다는 뜻. 라우터도 미들웨어이다
const goodsRouter = require("./routes/goods"); 
// const cartsRouter = require("./routes/carts")


// 순서가 중요함.  app.get을 거치면 미들웨어를 거치지 않는다.
// use가 먼저 나와야지 아래의 코드가 영향을 받는다. 미들웨어는 서버를 감싸고 있으니깐
//app.use로 미들웨어를 구현할 수 있음
const requestMiddleWare=(req,res,next)=>{
    console.log("request URL: ",req.originalUrl," - ", new Date());
    next();
};


app.use(express.json()); //바디로 들어오는 json형태의 데이터를 파싱해주는 미들웨어이다.


app.use(requestMiddleWare);


app.use("/api", [goodsRouter]); //, cartsRouter

// get이라는 메서드로 요청을 받았는데, 주소가 아무것도 없을 때 무엇인가 처리를 해주겠다.
// req, res라는 객체를 넣어줌. 프레임워크의 약속
//response=res를 보내겠다 
app.get("/",(req, res)=>{
    res.send("Hello World");
});


// 서버를 이 port로 키겠다. 두번째 매개변수(함수)가 호출된다. 첫번째 인자가 포트고 두번째가 함수로 해줘야함.
app.listen(port, ()=>{
    console.log(port, "포트로 서버가 커졌어요!")
});
