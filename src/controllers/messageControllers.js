import mongoose from "mongoose";
import { SchemaMessage } from '../models/message'

const Message = mongoose.model('Message', SchemaMessage);

export const sendMessage = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(404).json({ message: 'authentification failed' })
        }
        const newMessage = new Message({
            ...req.body,
            send: req.session.userId,
            recever: req.params.id,
        })
        await newMessage.save();

        res.status(200).json({ message: 'message envoyer', newMessage })

    } catch (error) {
        res.status(404).json({ message: error })
    }
}
export const readMessage = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(404).json({ message: 'authentification failed' })
        }
        const message = await Message
            .find({ recever: req.params.id })
            .find({ send: req.session.userId })
            .populate('send')
            .populate('recever')
        res.json(message)
    } catch (error) {
        res.status(404).json({ message: error })
    }
}
export const editMessage = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(404).json({ message: 'authentification failed' })
        }
        const { contenu } = req.body
        const Updatemessage = await Message.findOneAndUpdate({
            _id: req.params.idMessage,
            recever: req.params.id,
            send: req.session.userId,
        },
            { contenu: contenu },
            { new: true }
        )
        if (!Updatemessage) {
            return res.status(404).json({ message: 'echecs' })
        }
        res.json({ message: 'Message modifier' })
    } catch (error) {
        res.status(404).json({ message: error })
    }
}
export const getAllMessage = async (req, res) => {
    try {

        if (!req.session.userId) {
            return res.status(404).json({ message: 'authentification failed' })
        }
        const messages = await Message
        .find({
            $or: [
                { send: req.session.userId },
                { recever: req.session.userId }
            ]
        })
        .populate('send')
        .populate('recever');
    
    res.json({ messages });
    } catch (error) {
        res.status(405).json({ message: error })
    }
}

