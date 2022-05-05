import Joi from 'joi';
import { User } from './models';

class HttpError extends Error {
  statusCode: number;

  constructor (statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default {
  async createUser (data: { name: string }) {
    try {
      const { error } = Joi.object({ name: Joi.string().required() }).validate(data);
      if (error) {
        const { message } = error.details[0];
        throw new HttpError(400, message);
      }
      const user = await User.create(data);
      return user;
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        // Gets the message for the first error in errors array
        const [key] = Object.keys(err.errors);
        const { message } = err.errors[key];
        throw new HttpError(400, message);
      }
      throw err;
    }
  },

  async getAllUsers () {
    const users = await User.find();
    return users;
  },
};
