const crypto=require('crypto');

module.exports={
    md5:function(value){
        const hash=crypto.createHash('md5');
        hash.update(value,'utf8');
        return hash.digest('hex');
    }
}





