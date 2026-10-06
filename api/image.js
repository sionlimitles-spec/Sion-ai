export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;

  const response = await fetch('https://api.x.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'grok-imagine-image-2.0',
      prompt,
      n: 1,
      response_format: 'url'
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
