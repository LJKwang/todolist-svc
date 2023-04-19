const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')

process.env.NODE_ENV = process.env.NODE_ENV && process.env.NODE_ENV === "production" ? "productin" : "development";
if (process.env.NODE_ENV==="production")
    dotenv.config({ path : __dirname + "/.env2"}) // 형재 경로에 .env2가 추가된 경로
else
    dotenv.config(); // config하면 기본경로는 ".env"가 된다.


const logger = (req, res, next) => {
    console.log(`### ${req.method} ${req.url}`);
    next();
}

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser(process.env.SECRET));

app.get('/', (req, res) => {
    res.cookie('key1', 'value1', { httpOnly: true, maxAge: 60*60*1000, signed:true });
    res.send('<h1>쿠키 생성 완료</h1>');
})

app.get('/cookie', (req, res) => {
    res.send(`<h1>쿠키 확인 : ${req.signedCookies.key1}</h1><hr/>`)
})

app.get('/ko', (req, res) => { // 경로마다 if문을 사용하지 않고 간편하게 하기위해서 get 방식 사용 (경로는 요청경로를 표시하는 것)
    console.log(`### ${req.method} ${req.url}`);
    res.json({ requrl:req.url, msg:"안녕"});
})

app.listen(process.env.PORT, ()=>{
    console.log(`### ${process.env.PORT} 포트에서 서버가 구동되었습니다.`)
})