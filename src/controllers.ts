import Joi from 'joi';
import { isValidObjectId } from 'mongoose';
import { Hobby, User } from './models';

interface IUser { name: string };
interface IHobby {
  name: string;
  passionLevel?: string;
  year?: number;
  userId: string;
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
    const { error } = Joi.object({
      name: Joi.string().required(),
      passionLevel: Joi.string().valid('Low', 'Medium', 'High', 'Very-High'),
      year: Joi.number().min(1990).max(new Date().getFullYear()),
      userId: Joi.string().custom((value, helpers) => {
        if (isValidObjectId(value)) {
          return value;
        }
        return helpers.message({ custom: 'user id is invalid' });
      }).required(),
    }).validate(data);

    if (error) {
      const { message } = error.details[0];
      throw new HttpError(400, message);
    }

    const hobby = await Hobby.create(data);
    return hobby;
  },

  async geHobbies (userId: string) {
    if (!isValidObjectId(userId)) {
      throw new HttpError(404, 'User does not exist');
    }
    const hobbies = await Hobby.find({ userId }, { userId: 0 });
    return hobbies;
  },

  async deleteHobby (_id: string, userId: string) {
    if (!isValidObjectId(userId) || !isValidObjectId(_id)) {
      throw new HttpError(404, 'User and/or Hobby Id does not exist');
    }
    const hobby = await Hobby.findOneAndDelete({ _id, userId });
    if (!hobby) throw new HttpError(404, 'Hobby does not exist');
  }
};
