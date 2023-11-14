import  express from "express";
import { AddRegister,connexion,getInformation,getUser,editUser,findUser,deconnection } from "../controllers/userControllers";
import authMiddleware from "../middlewares/authMiddleware";
const useRoute=express.Router()

//Route incription
useRoute.post('/register',AddRegister)

//Route connextion
useRoute.post('/connexion',connexion)

//Route information utilisateur
useRoute.get('/information',authMiddleware,getInformation)

//route affiche tout les utilisateurs
useRoute.get('/user',authMiddleware,getUser)

//route modifier utilisateur
useRoute.put('/edit',authMiddleware,editUser)

//route recherche utilisateur
useRoute.post('/recherche/',authMiddleware,findUser)

//route lougout
useRoute.get('/deconnection',deconnection)
export default useRoute;