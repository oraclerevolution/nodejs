var express = require('express')
var app = express()

//SHOW LIST OF USERS
app.get('/', function(req, res, next){
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM users ORDER BY id DESC', function(err,rows, fields){
            if(err){
                req.flash('error', err)
                res.render('user/list', {
                    title : 'User List',
                    data: ''
                })   
            }else{
                //renvoyer la view list.ejs
                res.render('user/list', {
                    title: 'User List',
                    data: rows
                })
            }
        })
    })
})

//SHOW ADD USER FORM
app.get('/add', function(req, res, next){
    //renvoyer la view add.ejs
    res.render('user/add', {
        title: 'Ajouter un nouvel utilisateur',
        name: '',
        age: '',
        email: ''
    })
})

//ADD NEW USER POST ACTION
app.post('/add', function(req, res,next){
    req.assert('name', 'Name is required').notEmpty()
    req.assert('age', 'Age is required').notEmpty()
    req.assert('email', 'A valid email is required').isEmail()

    var errors = req.validationErrors()

    if(!errors){
        var user = {
            name: req.sanitize('name').escape().trim(),
            age: req.sanitize('age').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        req.getConnection(function(error, conn){
            conn.query('INSERT INTO users SET ?', user, function(err, result){
                if(err){
                    req.flash('error', err)

                    res.render('user/add', {
                        title: 'Ajouter un nouvel utilisateur',
                        age: user.age,
                        email: user.email
                    })
                }else {
                    req.flash('success', 'Data added successfully')

                    res.render('user/add', {
                        title: 'Ajouter un nouvel utilisateur',
                        name: '',
                        age: '',
                        email: ''
                    })
                }
            })
        })
    }else {
        var error_msg = ''
        errors.forEach(function(error){
            error_msg += error_msg + '<br>'
        })
        req.flash('error', error_msg)
        res.render('user/add', {
            title: 'Ajouter un nouvel utilisateur',
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
        })
    }
})

//SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM users WHERE id = ' + req.params.id, function(err, rows, fields){
            if(err) throw err

            //si ya pas d'user
            if(rows.length <= 0){
                req.flash('error', 'User not found with id = ' + req.params.id)
                res.redirect('/users')
            }else {
                res.render('/user/edit', {
                    title: 'Modifier un utlilisateur',
                    id: rows[0].id,
                    name: rows[0].name,
                    age: rows[0].age,
                    email: rows[0].email
                })
            }
        })
    })
})

//EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next){
    req.assert('name', 'Name is required').notEmpty()
    req.assert('age', 'Age is required').notEmpty()
    req.assert('email', 'A valid email is required').isEmail()

    var errors = req.validationErrors()
    if(!errors){

        var user = {
            name: req.sanitize('name').escape().trim(),
            age: req.sanitize('age').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        req.getConnection(function(error, conn){
            conn.query('UPDATE users SET ? WHERE id= ' + req.params.id, user, function(err, result){
                if(err){
                    req.flash('error', err)

                    res.render(('user/edit', {
                        title: 'Modifier utilisateur',
                        id: req.params.id,
                        name: req.params.name,
                        age: req.params.age,
                        email: req.params.email
                    }))
                }else{
                    req.flash('success', 'Data updated successfully !')

                    res.render('user/edit', {
                        title: 'Modifier l\'utilisateur',
                        id: req.params.id,
                        name: req.body.name,
                        age: req.body.age,
                        email: req.body.email
                    })
                }
            })
        })
    }
    else{
        var error_msg = ''
        errors.forEach(function(error){
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('user/edit', {
            title: 'Modifier User',
            id: req.body.id,
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
        })
    }
})

//DELETE USER

app.delete('/delete/(:id)', function(req, res, next){
    var user = { id: req.params.id}

    req.getConnection(function(error, conn){
        conn.query('DELETE FROM users WHERE id = ' + req.params.id, user, function(err, result){
            if(err){
                req.flash('error', err)
                res.redirect('/users')
            }else {
                req.flash('success', 'Utilisateur supprimé ! id = ' + req.params.id)

                res.redirect('/users')
            }
        })
    })
})

module.exports = app