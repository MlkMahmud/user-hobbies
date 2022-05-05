import { model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface IUser {
  name: string;
  hobbies: any[];
}

const userSchema = new Schema<IUser>({
  name: {
    required: [true, 'Name is required'],
    type: String,
    unique: true,
  },
  hobbies: [{ type: Schema.Types.ObjectId, ref: 'Hobby' }]
})

userSchema.plugin(uniqueValidator, { message: 'This {PATH} is already taken' });

export default model(
  'User',
  userSchema,
);
