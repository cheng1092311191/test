const { admin } = require('../config.json');
const { md5 } = require('../module/crypto.js');
const userCookies = {};
var upUser = function (info) {
    let userId=info.userId
    let user=info.user;
    let lastTime = Date.now()
    userCookies[userId] =info;
    userCookies[userId].token=sign(user + userId)
    userCookies[userId].lastTime=lastTime;
    return userCookies[userId];

}
var setUserCookie = function (userInfo) {
    this.cookie("userInfo", JSON.stringify(userInfo), {
        maxAge: 1000 * 60 * 5,
        path: '/',
        signed: true
    })
    return this;
}
var sign = function (value) {
    return md5(value + Date.now() + 'my is token');
};
var check = function (userInfo) {
    try {
        let { userId, token, user } = userInfo;
        if (userCookies[userId].token === token) {
            // let info = upUser(user, userId);
            // setUserCookie.call(res, info);
            return true;
        }
        return false;
    } catch (err) {
        return false
    }
};
module.exports = {
    check,
    login: function (req, res) {
        let { user, pass, userId } = req.body;
        if (user !== admin.user || pass !== admin.pass) return res.json({ status: 1, message: "帐号或密码错误！" })
        /**
         * 验证通过
         */
        userId = admin.userId;
        let info = upUser({
            userId,
            nickName:admin.nickName,
            user:admin.user
        });
        setUserCookie.call(res, info)
        return res.json({
            status: 0, message: "登录成功!", user: {
                user: info.user,
                nickName: info.nickName,
                userId: info.userId
            },
            url:'/'
        });

    },
    checked: function (req, res) {
        // res.writeHead(200);
        res.status(201);
        try {
            let userInfo = JSON.parse(req.signedCookies.userInfo);
            if (check(userInfo)) {
                setUserCookie.call(res, upUser(userInfo))
                return res.json({
                    status: 0, message: "欢迎回来!",
                    user: {
                        user: userInfo.user,
                        nickName: userInfo.nickName,
                        userId: userInfo.userId
                    }
                })
            }
            res.json({ status: 4, message: '请先登录。' })

        } catch (err) {
            res.json({ status: 4, message: '请先登录。' })
        }
        return false;
    }
}
