import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  publications: { type: Array, default: [] },
  trials: { type: Array, default: [] },
}, { timestamps: true });

const ConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionTitle: { type: String, default: 'New Conversation' },
  disease: { type: String, default: '' },
  patientName: { type: String, default: '' },
  messages: [MessageSchema],
}, { timestamps: true });

export default mongoose.model('Conversation', ConversationSchema);
