import Groq from 'groq-sdk';

export const generateAnswer = async (query, publications, trials, conversationHistory) => {
  const pubContext = publications.slice(0, 5).map((p, i) =>
    `[Paper ${i + 1}] "${p.title}" (${p.year}) by ${(p.authors || []).join(', ')}\nSummary: ${String(p.abstract).slice(0, 300)}`
  ).join('\n\n');

  const trialContext = trials.slice(0, 3).map((t, i) =>
    `[Trial ${i + 1}] "${t.title}" — Status: ${t.status}, Location: ${t.location}`
  ).join('\n\n');

  const historyContext = (conversationHistory || [])
    .slice(-4)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const systemPrompt = `You are Curalink, a medical research assistant. Answer ONLY based on the research data below. Do not make up facts.

${historyContext ? `Previous conversation:\n${historyContext}\n` : ''}

Research Publications:
${pubContext || 'No publications found.'}

Clinical Trials:
${trialContext || 'No trials found.'}`;

  const userPrompt = `Question: ${query}

Respond in this format:
**Condition Overview:** (2-3 sentences about the condition)

**Research Insights:** (key findings, cite [Paper 1], [Paper 2] etc.)

**Clinical Trial Summary:** (brief summary of relevant trials)

**Important Note:** This is for research only. Consult a doctor for medical decisions.`;

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 700,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content?.trim() || 'Could not generate response. Please try again.';
  } catch (err) {
    console.error('LLM error:', err.message);
    const msg = err.message || 'AI response unavailable right now.';
    return `[System Notice: ${msg}] Here are the research papers and trials found above.`;
  }
};
