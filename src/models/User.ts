import { model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
});
userSchema.set('toJSON', { versionKey: false });
userSchema.plugin(uniqueValidator, { message: 'This {PATH} is already taken' });

export default model(
  'User',
  userSchema,
);
