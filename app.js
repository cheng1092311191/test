const express=require('express')
const path=require('path');
const app=express();
const bodyParse=require('body-parser');
const router=require('./router')
const cookieParser =require('cookie-parser');
const api=require('./api');

app.use(cookieParser('nmsl'))
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({extended:false}))
//console.log(app.get('views'))
//app.set('view engine','html')
app.use('/static',express.static(path.join(__dirname,'static')));
app.get('/',router.showIndex);
app.post('/poll',router.polling);
app.post('/send',router.send);
app.post('/login',api.login);
app.post('/check',api.checked);
app.get('*',router.error404Image);
app.listen(80)