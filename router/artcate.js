// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入文章分类的路由处理函数模块
const artcate_handler = require('../router-handler/artcate')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章分类的验证模块
const { add_cate_schema } = require('../schema/artcate')
// 导入删除文章分类的模块
const { delete_cate_schema } = require('../schema/artcate')
const { get_cate_schema } = require('../schema/artcate')
const { update_cate_schema } = require('../schema/artcate')

// 获取文章分类的列表数据
router.get('/cates', artcate_handler.getArticleCates)
// 新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates)
//根据id删除文章分类
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)
//根据id获取文章分类
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArtCateById)
//更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)

// 向外共享路由对象
module.exports = router
