// Imports
const models = require('../models');
const fs = require('fs');

// Constants
const REGEX_NUMBERS = /^\d*\.?\d+$/;

// Voir toute les annonces
exports.getAllItems = (req, res) => {
    getItems()
        .then(items => {  
            if(items.length == 0) return res.status(400).json({ error : "Il n'y a aucunes annonces !"});
            return res.status(200).json(items);
        })
        .catch(error => {
            return res.status(400).json(error);
        })
}

// voir une annonce
exports.getItem = (req, res) => {

    getItemById(req.params.id)
        .then(item =>{
            if(item == null) return res.status(400).json({ error : "Aucune annonce trouvée !"});
            res.status(200).json(item);
        })
        .catch(error => {
            res.status(400).json(error);
        })
}

// Créer une annonce
exports.createItem = (req, res) => {
    // Params
    var image;
    var titre       = req.body.title;
    var description = req.body.description;
    var prix        = req.body.price;

    console.log(req.body)
    
    // Vérifie les inputs
    if (!titre || !description || !prix) {
        return res.status(400).json({ error: 'Certains champs sont vides !' });
    }

    // vérifie la longueur du titre de l'annonce
    if(titre.length < 9 || titre.length > 255) {
        return res.status(400).json({ error: 'Le titre doit avoir une longueur de 10 à 254 caractères.' });
    }

    // vérifie la longueur de la description de l'annonce
    if(description.length < 9 || description.length > 255) {
        return res.status(400).json({ error: 'La description doit avoir une longueur de 10 à 254 caractères.' });
    }

    // vérifie que le prix est un nombre
    if(!REGEX_NUMBERS.test(prix)) {
        return res.status(400).json({ error: 'Le prix doit contenir que des chiffres.' });
    }

    // Url de l'image
    image = `${req.protocol}://${req.get('host')}/images/items/${req.file.filename}`;


    getUserById(req.userId)
        .then(user => {
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            return queryCreateItem(user.id, req.body, image);
        })
        .then(item => {
            res.status(200).json({ success: "L'annonce a bien été créé !" });
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Modifier article
exports.updateItem = (req, res) => {

    var image;
    var titre       = req.body.title;
    var description = req.body.description;
    var prix        = req.body.price;
    
    // Vérifie les inputs
    if (!titre || !description || !prix) {
        return res.status(400).json({ error: 'Certains champs sont vides !' });
    }

    // vérifie la longueur du titre
    if(titre.length < 9 || titre.length > 255) {
        return res.status(400).json({ error: 'Le titre doit avoir une longueur de 10 à 254 caractères.' });
    }

    // vérifie la longueur de la description
    if(description.length < 9 || description.length > 255) {
        return res.status(400).json({ error: 'La description doit avoir une longueur de 10 à 254 caractères.' });
    }

    // vérifie le prix
    if(!REGEX_NUMBERS.test(prix)) {
        return res.status(400).json({ error: 'Le prix doit contenir que des chiffres.' });
    }

    getItemById(req.params.id)
        .then(item => {
            if(!item) return res.status(400).json({ error: "L'annonce n'existe pas !" });

            // Vérifie si c'est l'auteur ou un admin
            if(item.UserId !== req.userId) {
                if(!req.isAdmin) return res.status(401).json({ error: 'Accès interdit !' });
            }

            // Reprend l'image dans la bdd si aucune image est ajoutée
            if(!req.file) { 
                image = item.imageUrl; 
            } else {
                image = `${req.protocol}://${req.get('host')}/images/items/${req.file.filename}`;

                // Supprime l'ancienne image
                const filename = item.imageUrl.split('/images/')[1];

                fs.unlink("images/"+filename, function (error) {
                    if (error) throw error;
                    console.log('Image supprimée !');
                }); 
            }

            return queryUpdateItem(item, req.body, image);
        })
        .then(results => {
            res.status(200).json({ success: "L'annonce a été modifié !" });
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Supprimer l'annonce
exports.deleteItem = (req, res) => {

    getItemById(req.params.id)
        .then(item => {
            if(!item) return res.status(400).json({ error: "L'annonce n'existe pas !" });
            
            // Vérifie si c'est l'auteur ou l'admin
            if(item.UserId !== req.userId) {
                if(!req.isAdmin) return res.status(401).json({ error: 'Accès interdit !' });
            }

            // Supprime l'ancienne image
            const filename = item.imageUrl.split('/images/')[1];

            fs.unlink("images/"+filename, function (error) {
                if (error) throw error;
                // l'image est effacée avec succès !
                console.log('Image supprimée !');
            }); 

            return queryDeleteItem(item);
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

function getItems() {
    return new Promise((resolve, reject) => {

        const items = models.Item.findAll({
            order: [
                ['id', 'DESC']
            ],
            include: [{
                model: models.User,
                attributes: ['firstname', 'lastname', 'imgUrl']
            }]
        });

        if(items) {
            resolve(items);
        } else {
            reject(Error('Aucunes annonces trouvées !'));
        }
    })
}

function getItemById(id) {
    return new Promise((resolve, reject) => {

        const item = models.Item.findOne({
            where: { id: id },
            include: [{
                model: models.User,
                attributes: ['firstname', 'lastname', 'imgUrl']
            }]
        });

        if(item) {
            resolve(item);
        } else {
            reject(Error('Aucune annonce trouvée !'));
        }
    })
}

function queryCreateItem(userId, formParams, image) {
    return new Promise((resolve, reject) => {

        const newItem = models.Item.create({
            title: formParams.title,
            description: formParams.description,
            price: formParams.price,
            imageUrl: image,
            UserId: userId
        });

        if(newItem) {
            resolve(newItem);
        } else {
            reject(Error("Erreur dans la creation de l'annonce !"));
        }
    })
    
}

function queryUpdateItem(item, formParams, image) {
    return new Promise((resolve, reject) => {

        const updateItem = item.update({
            title: formParams.title,
            description: formParams.description,
            price: formParams.price,
            imageUrl: image,
            updatedAt: new Date()
        });

        if(updateItem) {
            resolve(updateItem);
        } else {
            reject(Error("Erreur dans la creation de l'annonce !"));
        }
    })
}

function queryDeleteItem(item) {
    return new Promise((resolve, reject) => {

        const itemRemove = item.destroy();

        if(itemRemove) {
            resolve(itemRemove);
        } else {
            reject(Error("Erreur dans la suppression de l'annonce !"));
        }
    })
}