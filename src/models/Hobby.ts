import { model, Schema } from 'mongoose';

const hobbySchema = new Schema({
  name: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  year: { type: Number, default: new Date().getFullYear() },
  passionLevel: { type: String }
});
hobbySchema.set('toJSON', { versionKey: false });

export default model(
  'Hobby',
  hobbySchema,
);
