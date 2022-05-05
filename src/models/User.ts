import { model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  hobbies: [{ type: Schema.Types.ObjectId, ref: 'Hobby' }]
});
userSchema.set('toJSON', { versionKey: false });
userSchema.plugin(uniqueValidator, { message: 'This {PATH} is already taken' });

export default model(
  'User',
  userSchema,
);
