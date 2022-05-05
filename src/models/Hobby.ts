import { model, Schema } from 'mongoose';

const hobbySchema = new Schema({
  name: { type: String },
  userId: { type: Schema.Types.ObjectId },
  year: { type: Number, default: new Date().getFullYear() },
  passionLevel: { type: String, default: 'Low' },
});
hobbySchema.set('toJSON', { versionKey: false });

export default model(
  'Hobby',
  hobbySchema,
);
