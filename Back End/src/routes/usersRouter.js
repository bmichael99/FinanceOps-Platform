import {Router} from "express";
import * as userController from "../controllers/userController";
import passport from 'passport';
const userRouter = Router();

userRouter.get("/users", passport.authenticate('jwt', {session: false}), userController.getAllUsers);
// userRouter.post("/users", userController.createUser);
// userRouter.put("/users/:userId", userController.updateUser);
// userRouter.delete("/users/:userId", userController.deleteUser);
// userRouter.get("/users/:userId", userController.getUserById);

export default userRouter;