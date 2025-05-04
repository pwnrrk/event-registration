import { checkSchema } from "express-validator";
import User from "../models/user";

const userValidator = checkSchema({
  firstName: {
    notEmpty: true,
  },
  lastName: {
    notEmpty: true,
  },
  phone: {
    notEmpty: true,
    custom: {
      options: async (value) => {
        const user = await User.findOne({ phone: value });
        if (user) throw new Error("User exists");
      },
      errorMessage: "USER_EXISTS",
    },
  },
});

export default userValidator;
