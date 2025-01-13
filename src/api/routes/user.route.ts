import { Router } from "express";
import { userController } from "@controllers";
import { validate, authenticate } from "@middlewares";
import { UserSchemas, UserFields } from '@validations'

const userRouter = Router();

userRouter.get(
  "/", 
  [
    authenticate,
    validate(UserSchemas, UserFields.GetAllUsers)
  ], 
  userController.getUsers
);

userRouter.get(
  "/:id", 
  [
    authenticate,
    validate(UserSchemas, UserFields.GetOneUser)
  ], 
  userController.getUser
);

userRouter.patch(
  "/:id/update-balance",
  [
    authenticate, 
    validate(UserSchemas, UserFields.UpdateUserBalancee)
  ],
  userController.updateUser
);

userRouter.patch(
  "/:id",
  [
    authenticate, 
    validate(UserSchemas, UserFields.UpdateOneUser)
  ],
  userController.updateUser
);

// Disabling a user of any type
userRouter.delete(
  "/:id",
  [
    authenticate,
    validate(UserSchemas, UserFields.DeleteOneUser)
  ],
  userController.disableUser
);

export default userRouter;