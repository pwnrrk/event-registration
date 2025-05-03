import { checkSchema } from "express-validator";

const userValidator = checkSchema({
  firstName: {
    notEmpty: true,
  },
  lastName: {
    notEmpty: true,
  },
  phone: {
    notEmpty: true,
  },
});

export default userValidator;
