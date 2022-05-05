import { model, Schema } from 'mongoose';

export default model(
  'Hobby',
  new Schema({
    name: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    year: { type: Number, default: new Date().getFullYear() },
    passionLevel: { type: String }
  }),
);
