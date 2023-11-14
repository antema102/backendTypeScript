import mongoose from "mongoose";
import { SchemaUser } from "../models/user"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


const User = mongoose.model('User', SchemaUser)

export const AddRegister = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUsername = await User.findOne({ username })

        if (existingUsername) {
            return res.status(400).json({ message: 'utilisateur identique' })
        }
        const hachagePassowrd = await bcrypt.hash(password, 10)
        const newUser = new User({
            ...req.body,
            password: hachagePassowrd
        })
        await newUser.save()
        return res.status(201).json({ message: 'utilisateur crée avec succés' })

    } catch (error) {
        console.error(error)
    }
}

export const connexion = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(405).json({ message: "nom d'utilisateur invalide" })
        }
        //verifie le mot de passe 
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(406).json({ message: "Mot de passe incorrect" })
        }
        req.session.userId = user._id
        req.session.save()

        const token = jwt.sign({ userId: req.session.userId }, 'votre_clé_secrète', { expiresIn: '1h' })
        res.json({ token })
    } catch (error) {
        console.log(error)
    }
}

export const getInformation = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(404).json({ message: "authentifiaction failed" })
        }
        const user = await User.findById(req.session.userId)
        res.json(user)
    } catch (error) {
        console.log(error)
    }
}

export const getUser = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(404).json({ message: "authentifiaction failed" })
        }
        const user = await User.find()
        res.json(user)
    } catch (error) {
        console.log(error)
    }
}

export const editUser = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(404).json({ message: 'Authentification failed' });
        }
        const { username, password, newPassword } = req.body;
        const user = await User.findById({ _id: req.session.userId });
        const userAll = await User.findOne({ username: username });

        if (userAll && userAll.username === username) {
            return res.status(404).json({ message: 'pseudo deja prise' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(404).json({ message: 'votre mot de passe incorrect' });
        }
        if (password === newPassword) {
            return res.status(404).json({ message: 'Mot de passe identique pour le precedent' });
        }

        const hachagePassowrd = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.updateOne(
            { _id: req.session.userId },
            {
                $set: {
                    username: username,
                    password: hachagePassowrd
                }
            }
        );

        if (updatedUser) {
            return res.status(202).json({ message: 'Utilisateur modifie' });
        } else {
            return res.status(401).json({ message: 'erreur de modification' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const findUser = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(404).json({ message: 'Authentification failed' })
        }
        const { username } = req.body;
        const query = { username: { $regex: '^' + username, $options: 'i' } };
        const user = await User.find(query)
        if (user.length === 0) {
            return res.status(404).json({ messag: 'aucune utilisateur' })
        }
        res.json(user);
    } catch (error) {
        console.log(error)
    }
}

export const deconnection = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(404).json({ message: 'Authenficication failed' })
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(404).json({ message: 'deconnection impossible' })
            } else {
                res.clearCookie('connect.sid');
                res.status(200).json({ message: 'Utilisateur déconnecté avec succès' });
            }
        })

    } catch (error) {
        console.log(error)
    }
}
