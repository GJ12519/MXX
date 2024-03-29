
// 导入数据库操作模块
const { result } = require('@hapi/joi/lib/base')
const { query } = require('express')
const db = require('../db/index')


// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    //定义SQL语句
    const sql = 'select * from ev_artide_cate where is_delete=0 order by id asc'
    db.query(sql, (err, result) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类列表成功',
            data: result
        })
    })
}

//文章分类
exports.addArticleCates = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_artide_cate where name=? or alias=?`
    // 执行查重操作
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // TODO：新增文章分类
        const sql = 'insert into ev_artide_cate set ?'
        db.query(sql, [req.body], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败')
            res.cc('新增文章分类成功')
        })
    })

}

//根据id删除文章分类
exports.deleteCateById = (req, res) => {
    const sql = `update ev_artide_cate set is_delete=1 where id=?`
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        res.cc('删除文章分类成功！', 0)
    })
}

//获取文章分类
exports.getArtCateById = (req, res) => {
    const sql = 'select * from ev_artide_cate where id = ?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类成功！',
            data: results[0]
        })
    })
}

//更新文章分类
exports.updateCateById = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_artide_cate where Id<>? and (name=? or alias=?)`
    // 执行查重操作
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！' )
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // TODO：更新文章分类
        const sql = `update ev_artide_cate set ? where Id=?`
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')

            // 更新文章分类成功
            res.cc('更新文章分类成功！', 0)
        })

    })

}