import { checkSchema } from "express-validator";
import User from "../models/user";
import { countUsers } from "../repositories/userRepository";
import { countSeats } from "../repositories/seatRepository";

const userValidator = checkSchema({
  firstName: {
    notEmpty: true,
    custom: {
      options: async () => {
        const totalUser = await countUsers({});
        const totalSeat = await countSeats({});
        if (totalUser === totalSeat) throw new Error("SESSION_FULL");
      },
      errorMessage: "SESSION_FULL",
    },
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
