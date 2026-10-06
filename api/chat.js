export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, model, thinkMode, searchMode } = req.body;

  const body = {
    model: model || 'grok-4.7',
    messages,
    stream: true,
    max_tokens: 4096
  };
  if (thinkMode) body.reasoning_effort = 'high';
  if (searchMode) body.search_parameters = { mode: 'auto' };

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(decoder.decode(value));
  }
  res.end();
}
