import  express from "express";
import { sendMessage,readMessage,editMessage,getAllMessage } from "../controllers/messageControllers";
import authMiddleware from "../middlewares/authMiddleware";

const messageRoute=express.Router()

//envoyer message
messageRoute.post('/write/:id',authMiddleware,sendMessage)

//regader message
messageRoute.get('/read/:id',authMiddleware,readMessage)

//modifier message
messageRoute.put('/reads/:id/:idMessage',authMiddleware,editMessage)


//regarder les message 
messageRoute.get('/read/')


//regarder tout les message que je recoit et ce que j'ai
messageRoute.get('/reades',getAllMessage)

export default messageRoute;

