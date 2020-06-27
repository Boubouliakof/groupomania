// Imports
const models = require('../models');
const fs = require('fs');

// Voir toute les posts
exports.getAllPosts = (req, res) => {
    getPosts()
        .then(posts => {  
            if(posts.length == 0) return res.status(400).json({ error : "Il n'y a aucun post !"});
            return res.status(200).json(posts);
        })
        .catch(error => {
            return res.status(400).json(error);
        })
}

// voir un post
exports.getPost = (req, res) => {

    getPostById(req.params.id)
        .then(post =>{
            if(post == null) return res.status(400).json({ error : "Aucun post trouvé !"});
            res.status(200).json(post);
        })
        .catch(error => {
            res.status(400).json(error);
        })
}

// Créer un post
exports.createPost = (req, res) => {
    // Params
    var image;
    var post       = req.body.post;

    console.log(req.body)
    
    // Vérifie les inputs
    if (!post) {
        return res.status(400).json({ error: ' champs post est vide !' });
    }

    // Url de l'image
    image = `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`;


    getUserById(req.userId)
        .then(user => {
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            return queryCreatePost(user.id, req.body, image);
        })
        .then(post => {
            res.status(200).json({ success: "Le post a bien été créé !" });
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Modifier post
exports.updatePost = (req, res) => {

    var image;
    var post       = req.body.post;
    
    // Vérifie les inputs
    if (!post) {
        return res.status(400).json({ error: 'champs post est vide ' });
    }

    getPostById(req.params.id)
        .then(post => {
            if(!post) return res.status(400).json({ error: "L'annonce n'existe pas !" });

            // Vérifie si c'est l'auteur ou un admin
            if(post.UserId !== req.userId) {
                if(!req.isAdmin) return res.status(401).json({ error: 'Accès interdit !' });
            }

            // Reprend l'image dans la bdd si aucune image est ajoutée
            if(!req.file) { 
                image = post.imageUrl; 
            } else {
                image = `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`;

                // Supprime l'ancienne image
                const filename = post.imageUrl.split('/images/')[1];

                fs.unlink("images/"+filename, function (error) {
                    if (error) throw error;
                    console.log('Image supprimée !');
                }); 
            }

            return queryUpdatePost(post, req.body, image);
        })
        .then(results => {
            res.status(200).json({ success: "Le post a été modifié !" });
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Supprimer le post
exports.deletePost = (req, res) => {

    getPostById(req.params.id)
        .then(post => {
            if(!post) return res.status(400).json({ error: "Le post n'existe pas !" });
            
            // Vérifie si c'est l'auteur ou l'admin
            if(post.UserId !== req.userId) {
                if(!req.isAdmin) return res.status(401).json({ error: 'Accès interdit !' });
            }

            // Supprime l'ancienne image
            const filename = post.imageUrl.split('/images/')[1];

            fs.unlink("images/"+filename, function (error) {
                if (error) throw error;
                // l'image est effacée avec succès !
                console.log('Image supprimée !');
            }); 

            return queryDeletePost(post);
        })
        .then(results => {
            res.status(200).json({ success: 'Annonce supprimée !' });
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Les fonctions 
function getUserById(id) {
    return new Promise((resolve, reject) => {

        const user = models.User.findOne({
            attributes: ['id', 'firstname', 'lastname', 'email', 'imgUrl'],
            where: { id: id }
        });

        if(user) {
            resolve(user);
        } else {
            reject(Error('Aucun utilisateur trouvé !'));
        }
    })
}

function getPosts() {
    return new Promise((resolve, reject) => {

        const posts = models.Post.findAll({
            order: [
                ['id', 'DESC']
            ],
            include: [{
                model: models.User,
                attributes: ['firstname', 'lastname', 'imgUrl']
            }]
        });

        if(posts) {
            resolve(posts);
        } else {
            reject(Error('Aucunes annonces trouvées !'));
        }
    })
}

function getPostById(id) {
    return new Promise((resolve, reject) => {

        const post = models.Post.findOne({
            where: { id: id },
            include: [{
                model: models.User,
                attributes: ['firstname', 'lastname', 'imgUrl']
            }]
        });

        if(post) {
            resolve(post);
        } else {
            reject(Error('Aucun post trouvé !'));
        }
    })
}

function queryCreatePost(userId, formParams, image) {
    return new Promise((resolve, reject) => {

        const newPost = models.Post.create({
            post: formParams.post,
            imageUrl: image,
            UserId: userId
        });

        if(newPost) {
            resolve(newPost);
        } else {
            reject(Error("Erreur dans la création du post !"));
        }
    })
    
}

function queryUpdatePost(post, formParams, image) {
    return new Promise((resolve, reject) => {

        const updatePost = post.update({
            post: formParams.post,
            imageUrl: image,
            updatedAt: new Date()
        });

        if(updatePost) {
            resolve(updatePost);
        } else {
            reject(Error("Erreur dans la création du post !"));
        }
    })
}

function queryDeletePost(post) {
    return new Promise((resolve, reject) => {

        const postRemove = post.destroy();

        if(postRemove) {
            resolve(postRemove);
        } else {
            reject(Error("Erreur dans la suppression de l'annonce !"));
        }
    })
}