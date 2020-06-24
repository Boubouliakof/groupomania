// Imports
const bcrypt = require('bcrypt');
const models = require('../models');
const jwt = require('jsonwebtoken');
const config = require("../config/auth.config");
const fs = require('fs');

// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
const LETTERS_REGEX = /^[A-Za-z]+$/;
const BIRTH_REGEX = /^^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;


// Inscription
exports.register = (req, res) => {

    var imageUrl;
    var email      = req.body.email;
    var nom        = req.body.lastname;
    var prenom     = req.body.firstname;
    var service     = req.body.service;
    var age         = req.body.age;
    var motdepasse = req.body.password;

    console.log(req.body)
    console.log(req.file)

    if (!email || !motdepasse || !nom || !prenom || !service || !age) {
        return res.status(400).json({ error: 'Certains champs sont vides !' });
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Adresse mail non valide" });
    }

    if (prenom.length > 21 || prenom.length < 2) {
        return res.status(400).json({ error: 'Le prénom doit avoir une longueur de 3 à 19 caractères.' });
    }
    if(!prenom.match(LETTERS_REGEX)) {
        return res.status(400).json({ error: 'Le prénom doit contenir que des lettres' });
    }

    if (nom.length >= 20 || nom.length < 3) {
        return res.status(400).json({ error: 'Le nom doit avoir une longueur de 3 à 19 caractères.' });
    }
    if(!nom.match(LETTERS_REGEX)) {
        return res.status(400).json({ error: 'Le nom doit contenir que des lettres' });
    }

    if (!BIRTH_REGEX.test(age)) {
        return res.status(400).json({ error: 'La date est invalide. Elle doit être sous le format JJ/MM/AAAA.' });
    }

    if (!PASSWORD_REGEX.test(motdepasse)) {
        return res.status(400).json({ error: 'Le mot de passe est invalide. Il doit avoir au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial et une longueur d\'au moins 10.' });
    }
    
    if(!req.file) return res.status(400).json({ error: "Une image est obligatoire !" });
    imageUrl = `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}`;

    // Renvoie l'utilisateur avec email
    getUserByEmail(email)
        .then(user => {
            if(user) return res.status(400).json({ error: "L'utilisateur existe déjà !" });

            return cryptPassword(motdepasse);
        })
        .then(bcryptedPassword => {
            // creation de l'utilisateur
            models.User.create({
                firstname: prenom,
                lastname: nom,
                service: service,
                age: age,
                email: email,
                password: bcryptedPassword,
                imgUrl: imageUrl,
                isAdmin: 0
            });

            return res.status(200).json({ success: 'Utilisateur enregistré !' });
        })
        .catch(error => {
            return res.status(400).json({ error });
        })
}

// Connexion
exports.login = (req, res) => {
    // Params
    var email    = req.body.email;
    var password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).json({ error: 'Certains champs sont vides !' });
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Adresse mail non valide" });
    }
    
    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ error: 'Le mot de passe est invalide. Il doit avoir une longueur de 4 à 16 caractères et contenir au moins 1 chiffre.' });
    }

    // Renvoie l'utilisateur avec email
    getUserByEmail(email)
        .then(user => {
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            return comparePassword(password, user.password, user);
        })
        .then(user => {
            // Generation du token
            var token = jwt.sign(
                {
                  userId: user.id,
                  isAdmin: user.isAdmin
                },
                config.secret,
                { expiresIn: '12h' } // 12h pour le temps de présence max au bureau
            );

            // return userId & token
            res.status(200).json({
                userId: user.id,
                token: token
            });
        })
        .catch(error => {
            res.status(401).json({ error });
        })
}

// Déconnexion
exports.logout = (req, res) => {

    getUserById(req.userId)
        .then(user => {
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            return res.status(200).json({
                success: 'Déconnexion réussite !'
            });
        })
        .catch(error => {
            return res.status(401).json(error);
        })
}

// Voir user
exports.getUserProfile = (req, res) => {

    getUserById(req.userId)
        .then(user =>{
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            return res.status(200).json(user);
        })
        .catch(error => {
            return res.status(400).json(error);
        })
}

// Modifier user
exports.updateUserProfile = (req, res) => {

    if (!req.body.email || !req.body.firstname || !req.body.lastname) {
        return res.status(400).json({ error: 'Certains champs sont vides !' });
    }

    if (!EMAIL_REGEX.test(req.body.email)) {
        return res.status(400).json({ error: "Adresse mail non valide" });
    }

    if (req.body.firstname.length > 21 || req.body.firstname.length < 2) {
        return res.status(400).json({ error: 'Le prénom doit avoir une longueur de 3 à 19 caractères.' });
    }
    if(!req.body.firstname.match(LETTERS_REGEX)) {
        return res.status(400).json({ error: 'Le prénom doit contenir que des lettres' });
    }

    if (req.body.lastname.length >= 20 || req.body.lastname.length < 3) {
        return res.status(400).json({ error: 'Le nom doit avoir une longueur de 3 à 19 caractères.' });
    }
    if(!req.body.lastname.match(LETTERS_REGEX)) {
        return res.status(400).json({ error: 'Le nom doit contenir que des lettres' });
    }

    getUserById(req.userId)
        .then(user => {
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            if(!req.file) { 
                imageUrl = user.imgUrl; 
            } else {
                imageUrl = `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}`;

                const filename = user.imgUrl.split('/images/')[1];

                fs.unlink("images/"+filename, function (error) {
                    if (error) return console.log(error);
                    console.log('Image supprimée !');
                }); 
            }

            return queryUpdateUser(user, req.body, imageUrl);
        })
        .then(results => {
            res.status(200).json({ success: "Compte modifié !"});
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Supprime user
exports.deleteUserProfile = (req, res) => {

    getUserById(req.userId)
        .then(user => {
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            const filename = user.imgUrl.split('/images/')[1];

            fs.unlink("images/"+filename, function (error) {
                if (error) return console.log(error);
                console.log('Image supprimée !');
            }); 
            
            return queryDeleteUser(user);
        })
        .then(results => {
            res.status(200).json({ message: 'Compte supprimé !' });
        })
        .catch(err => {
            res.status(400).json({ err });
        })
}


// Fonctions
function getUserById(id) {
    return new Promise((resolve, reject) => {

        const user = models.User.findOne({
            attributes: ['id', 'firstname', 'lastname', 'service', 'age', 'email', 'imgUrl', 'isAdmin'],
            where: { id: id }
        });

        if(user) {
            resolve(user);
        } else {
            reject(Error('Aucun utilisateur trouvé !'));
        }
    })
}

function getUserByEmail(email) {
    return new Promise((resolve, reject) => {


        // Fonctionne uniquement pour obtenir le mot de passe
        const user = models.User.findOne({
            attributes: ['id', 'firstname', 'lastname', 'service', 'age', 'email', 'imgUrl', 'password', 'isAdmin'],
            where: { email: email }
        });

        if(user) {
            resolve(user);
        } else {
            reject('Adresse email incorrect !');
        }
    })
}

function queryUpdateUser(user, formParams, imageUrl) {
    return new Promise((resolve, reject) => {
        
        const userModify = user.update(
            {
                firstname: formParams.firstname,
                lastname: formParams.lastname,
                service: formParams.service,
                age: formParams.age,
                email: formParams.email,
                imgUrl: imageUrl,
                updatedAt: new Date()
            }
        );

        if(userModify) {
            resolve(userModify);
        } else {
            reject(Error('Erreur dans la modification !'));
        }
    })
}

function queryDeleteUser(user) {
    return new Promise((resolve, reject) => {

        const userRemove = user.destroy();

        if(userRemove) {
            resolve(userRemove);
        } else {
            reject(Error('Erreur dans la suppression du compte !'));
        }
    })
}

function comparePassword(formPassword, dbPassword, userData) {
    return new Promise((resolve, reject) => {

        const result = bcrypt.compareSync(formPassword, dbPassword);

        if(result) {
            resolve(userData);
        } else {
            reject('Le mot de passe est incorrect !');
        }
    })
    
}

function cryptPassword(password) {
    return new Promise((resolve, reject) => {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        if(hash) {
            resolve(hash);
        } else {
            reject('Un problème est survenu !'); //Probleme pour crypter le mot de passe
        } 
    })
}
