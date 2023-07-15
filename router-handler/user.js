//导入数据库操作模块
const db = require('../db/index')

//导入bcryptjs
const bcryptjs = require('bcryptjs')

//导入生成token的包
const jwt = require('jsonwebtoken')
//导入全局的配置文件
const config = require('../config')

//注册用户的函数
exports.regUser = (req, res) => {
    //通过req.body拿到用户提交的信息
    const userinfo = req.body
    // console.log(userinfo);
    //对用户提交的表单信息进行验证
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({
    //         status: 1,
    //         message: '用户或密码不能为空！'
    //     })
    // }

    //定义sql语句，查询用户名是否被使用
    const sqlstr = 'select * from ev_users where username = ?'
    //执行 SQL 语句并根据结果判断用户名是否被占用
    db.query(sqlstr, userinfo.username, (err, results) => {
        //执行SQL语句失败
        if (err) {
            // return res.send({
            //     status: 1,
            //     message: err.message
            // })
            return res.cc(err)
        }
        //用户被占用
        if (results.length > 0) {
            // return res.send({
            //     status: 1,
            //     message: '用户被占用，请更换其他用户名!'
            // })
            return res.cc('用户被占用，请更换其他用户名!')
        }

        //调用bcryptjs.hashSync()对密码进行加密
        userinfo.password = bcryptjs.hashSync(userinfo.password, 10)
        // console.log(userinfo);
        // const a = bcrypt.compareSync(userinfo.password, hash);
        // console.log(a);

        //用户名可以使用之后，开始注册用户
        const sql = 'insert into ev_users set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            //判读SQL语句是否执行成功
            if (err) {
                // return res.send({
                //     status: 1,
                //     message: err.message
                // })
                return res.cc(err)
            }
            if (results.affectedRows !== 1) {
                // return res.send({
                //     status: 1,
                //     message: '注册用户失败，请稍后再试！'
                // })
                return res.cc('注册用户失败，请稍后再试！')
            }
            // res.send({
            //     status: 0,
            //     message: '注册用户成功！'
            // })
            res.cc('注册用户成功！', 0)
        })
    })
    // res.send('regUser ok')
}

//登录的处理函数
exports.login = (req, res) => {
    //接收表单的数据
    const userinfo = req.body
    //定义SQL语句
    const sql = 'select * from ev_users where username = ?'
    //执行SQL语句，更具用户名查询用户的信息
    db.query(sql, userinfo.username, (err, results) => {
        //执行SQL语句失败
        if (err) {
            return res.cc(err)
        }
        if (results.length !== 1) {
            return res.cc('账户错误，请重新输入！')
        }
        //判断密码是否正确
        const compareResult = bcryptjs.compareSync(userinfo.password, results[0].password)

        if (!compareResult) {
            return res.cc('密码错误，请重新输入！')
        }

        //在服务器端生成token字符串
        //剔除密码和头像
        const user = { ...results[0], password: '', user_pic: '' }
        // console.log(user);
        //对用户的信息进行加密，生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        //调用res.send()将token相应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer' + tokenStr
        })
        // res.send('login ok')
    })
}
