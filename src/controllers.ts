import Joi from 'joi';
import { Hobby, User } from './models';

interface IUser { name: string };
interface IHobby {
  name: string;
  passionLevel: string;
  year: number;
  user: string;
}

class HttpError extends Error {
  statusCode: number;

  constructor (statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default {
  async createUser (data: IUser) {
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

  async createHobby (data: IHobby) {
    try {
      const { error } = Joi.object({
        name: Joi.string().required(),
        passionLevel: Joi.string().valid('Low', 'Medium', 'High', 'Very-High'),
        year: Joi.number().min(1990).max(new Date().getFullYear()),
        user: Joi.string().hex().length(24).required(),
      }).validate(data);

      if (error) {
        const { message } = error.details[0];
        throw new HttpError(400, message);
      }

      const hobby = await Hobby.create(data);
      return hobby;
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const [key] = Object.keys(err.errors);
        const { message } = err.errors[key];
        throw new HttpError(400, message);
      }
      throw err;
    }
  }
};
