import Conversation from '../models/Conversation.js';
import { expandQuery } from '../services/queryExpander.js';
import { fetchPubMed } from '../services/pubmedService.js';
import { fetchOpenAlex } from '../services/openAlexService.js';
import { fetchClinicalTrials } from '../services/clinicalTrialsService.js';
import { rankResults } from '../services/ranker.js';
import { generateAnswer } from '../services/llmService.js';

export const sendMessage = async (req, res) => {
  const { message, disease, patientName, conversationId } = req.body;
  const userId = req.user.userId;

  if (!message) return res.status(400).json({ msg: 'Message is required' });

  let conversation;
  if (conversationId) {
    conversation = await Conversation.findOne({ _id: conversationId, userId });
  }
  if (!conversation) {
    conversation = new Conversation({
      userId,
      disease: disease || '',
      patientName: patientName || '',
      sessionTitle: message.slice(0, 50),
      messages: [],
    });
  }

  conversation.messages.push({ role: 'user', content: message });

  const expandedQuery = expandQuery(message, disease || conversation.disease);

  const [pubmedResults, openAlexResults, clinicalTrials] = await Promise.all([
    fetchPubMed(expandedQuery),
    fetchOpenAlex(expandedQuery),
    fetchClinicalTrials(disease || conversation.disease || message),
  ]);

  const allPublications = [...pubmedResults, ...openAlexResults];
  const topPublications = rankResults(allPublications, expandedQuery, 8);
  const topTrials = rankResults(clinicalTrials, expandedQuery, 5);

  const recentMessages = conversation.messages.slice(-6);
  const aiAnswer = await generateAnswer(message, topPublications, topTrials, recentMessages);

  conversation.messages.push({
    role: 'assistant',
    content: aiAnswer,
    publications: topPublications,
    trials: topTrials,
  });

  await conversation.save();

  res.json({
    success: true,
    answer: aiAnswer,
    publications: topPublications,
    trials: topTrials,
    conversationId: conversation._id,
  });
};

export const getConversations = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [conversations, total] = await Promise.all([
    Conversation.find({ userId: req.user.userId })
      .select('sessionTitle disease createdAt updatedAt')
      .sort('-updatedAt')
      .skip(skip)
      .limit(limit),
    Conversation.countDocuments({ userId: req.user.userId })
  ]);

  res.json({ 
    success: true, 
    data: conversations,
    pagination: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    }
  });
};

export const getConversationById = async (req, res) => {
  const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!conversation) return res.status(404).json({ msg: 'Conversation not found' });
  res.json({ success: true, data: conversation });
};

export const deleteConversation = async (req, res) => {
  await Conversation.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  res.json({ success: true, msg: 'Conversation deleted' });
};
