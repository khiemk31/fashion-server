const { isEmpty } = require('../utils/validate');
const { getConnection, query } = require('../utils/database');
const categorySQL = require('../sql/categorySQL');
const moment = require('moment');
const { uploadImage } = require('../utils/image');
let jwt = require('jsonwebtoken');
const userSQL = require('../sql/userSQL');
//Web View
const getAddCategory = async (req, res) => {
    res.render('insert_category');
};
const addCategory = async (req, res) => {
    try {
        const data = req.body;
        if (req.files.category_image.data) {
            var categoryImage = 'data:image/jpeg;base64,' + req.files.category_image.data.toString('base64');
            const upload = await uploadImage(categoryImage);
            categoryImage = upload.url;
        }
        const connection = await getConnection(req);
        const category = await query(connection, categorySQL.categoryQueryByNameSQL, [data.category_name]);
        if (!isEmpty(category)) {
            return res.status(404).json({ message: 'Đã tồn tại ' });
        } else {
            await query(connection, categorySQL.insertCategorySQL, {
                category_name: data.category_name,
                category_image: categoryImage,
                created_at: new Date(),
            });
            const listCategory = await query(connection, categorySQL.queryListCategory);
            for (const category of listCategory) {
                if (category.created_at) {
                    category.created_at = moment(category.created_at).format('DD-MM-YYYY');
                }
                if (category.updated_at) {
                    category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
                }
                if (category.deleted_at) {
                    category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
                }
            }
            res.render('category', { listCategory: listCategory });
        }
    } catch (e) {
        return res.status(500).json({ message: `${e}` });
    }
};
//Lấy ds thể loại
const category = async (req, res) => {
    const connection = await getConnection(req);
    const listCategory = await query(connection, categorySQL.listCategoryQuerySQL);
    const user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
    const permission = await query(connection, userSQL.queryPermissionUser, [user_id])
    for (const category of listCategory) {
        if (category.created_at) {
            category.created_at = moment(category.created_at).format('DD-MM-YYYY');
        }
        if (category.updated_at) {
            category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
        }
        if (category.deleted_at) {
            category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
        }
    }
    res.render('category', { listCategory: listCategory, permission: permission[0].permission });
};
//Ản thể loại
const hiddenCategory = async (req, res) => {
    const { id } = req.params;
    const connection = await getConnection(req);
    const user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
    const permission = await query(connection, userSQL.queryPermissionUser, [user_id])
    await query(connection, categorySQL.updateHiddenCategory, [new Date(), id]);
    const listCategory = await query(connection, categorySQL.listCategoryQuerySQL);
    for (const category of listCategory) {
        if (category.created_at) {
            category.created_at = moment(category.created_at).format('DD-MM-YYYY');
        }
        if (category.updated_at) {
            category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
        }
        if (category.deleted_at) {
            category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
        }
    }
    res.render('category', { listCategory: listCategory, permission: permission[0].permission });
};
//Show thể loại 
const showCategory = async (req, res) => {
    const { id } = req.params;
    const connection = await getConnection(req);
    const user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
    const permission = await query(connection, userSQL.queryPermissionUser, [user_id])
    await query(connection, categorySQL.updateShowCategory, [id]);
    const listCategory = await query(connection, categorySQL.listCategoryQuerySQL);
    for (const category of listCategory) {
        if (category.created_at) {
            category.created_at = moment(category.created_at).format('DD-MM-YYYY');
        }
        if (category.updated_at) {
            category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
        }
        if (category.deleted_at) {
            category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
        }
    }
    res.render('category', { listCategory: listCategory, permission: permission[0].permission });
}
//View Update thể loại
const getUpdateCategory = async (req, res) => {
    const data = req.params;
    const connection = await getConnection(req);
    const search = 'select *  from category where  category_id=?';
    const listCategory = await query(connection, search, [data.id]);
    res.render('insert_category', { category: listCategory[0], update: true });
};
//update thể loại
const update = async (req, res) => {
    const data = req.body;
    const connection = await getConnection(req);
    const updateCategoryQuery = `UPDATE category SET category_name='${data.category_name}' , updated_at=? WHERE category_id='${data.category_id}'`;
    await query(connection, updateCategoryQuery, [new Date()]);
    const listCategory = await query(connection, categorySQL.listCategoryQuerySQL);
    for (const category of listCategory) {
        if (category.created_at) {
            category.created_at = moment(category.created_at).format('DD-MM-YYYY');
        }
        if (category.updated_at) {
            category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
        }
        if (category.deleted_at) {
            category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
        }
    }
    res.render('category', { listCategory: listCategory });
};

//API Category
//Lấy tất cả
const getAll = async (req, res) => {
    try {
        const connection = await getConnection(req);
        const category = await query(connection, categorySQL.queryListCategory);
        return res.status(200).json({ message: 'thành công', data: category });
    } catch (e) {
        return res.status(500).json({ message: `${e}` });
    }
};
module.exports = {
    getAll,
    hiddenCategory,
    update,
    addCategory,
    getAddCategory,
    getUpdateCategory,
    category,
    showCategory
};
