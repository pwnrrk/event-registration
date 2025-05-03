import { checkSchema } from "express-validator";
import Seat from "../models/seat";

const seatValidator = checkSchema({
  seatNo: {
    notEmpty: true,
    custom: {
      options: async (value) => {
        const seat = await Seat.findOne({ seatNo: value });
        if (seat) throw new Error("Seat exists");
      },
      errorMessage: "Seat number must be unique",
    },
  },
});

export default seatValidator;
