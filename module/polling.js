const deferred={};
const timeOut=1000*50;
function addPolling(res,symbol){
    res.symbol=symbol;
    res.setTimeout(timeOut,(ev)=>{
        res.json({status:0})
    });
    res.once(symbol,function(msgObj){
        console.log(deferred)
        this.writeHead(200,{
            'content-Type':'text/text;charset=UTF8;'
        })

        let response=typeof msgObj==='object'?JSON.stringify(msgObj):''+msgObj;
        this.end(response)
    })
    //deferred.push(res);
    deferred[symbol]=deferred[symbol]||[];
    deferred[symbol].push(res)
    res.on('close',function(){
        deferred[this.symbol].some((element,index,array) => {
            if(element===this){
                array.shift(index);
                return true;
            }
        });
        if(deferred[this.symbol].length==0)delete deferred[this.symbol]

    })
}
function dispose(symbol,msg){

    deferred[symbol]&&deferred[symbol].forEach(value=>{
            value.emit(symbol,msg);
            //return true;    
    })

}
module.exports={
    addPolling,
    dispose
}