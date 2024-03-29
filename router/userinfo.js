const express = require('express')
const router = express.Router()

// 导入用户信息的处理函数模块
const userinfo_handler = require('../router-handler/userinfo')
// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象————更新用户的基本信息
const { update_userinfo_schema } = require('../schema/user')
// 导入需要的验证规则对象————更新密码
const { update_password_schema } = require('../schema/user')
//导入更新头像的验证规则更新头像
const { update_avatar_schema } = require('../schema/user')

// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户的基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
// 重置密码的路由
// router.post('/updatepwd', userinfo_handler.updatePassword)
//更新密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)
//更新头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvater)

module.exports = router
