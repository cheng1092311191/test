const router=require('express').Router()
const { json } = require('express');
const fs=require('fs');
const poll=require('../module/polling.js');
const api=require('../api/index');

module.exports={
    polling:function(req,res){
        let body=req.body;
        let cookies=req.signedCookies;
        try{
            let userInfo = JSON.parse(cookies.userInfo)
            if(!api.check(userInfo)) throw 4;
            if(!body.id)throw 4; ;
            poll.addPolling(res,body.id)
        }catch(err){
        res.json({status:4,message:"请先登录。"})            
        }

    },
    send:function(req,res){
        let body=req.body;
        if(body.msg) {
            poll.dispose(body.id,{status:0,msg:body.msg,host:req.headers.host});
        }
        res.writeHead(200);
        res.end();
    },
    showIndex:function(req,res){
        res.writeHead(302,{'location':'/static/index.html'}).end()
    },
    error404Image:function(req,res,next){
        fs.readFile('./img/404.jpg',(err,buffer)=>{
            if(!err){
                res.setHeader('content-Type','image/jpg;')
                res.statusCode=404;
                res.end(buffer);}
        })
    }
}