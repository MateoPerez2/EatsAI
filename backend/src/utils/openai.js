// src/utils/openai.js
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

exports.analyzeImageWithOpenAI = async (base64Image, detail = 'low') => {
  try {
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: "What's in this image?" },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: detail, // 'low' or 'high'
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    };

    const response = await axios.post(OPENAI_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    return response.data.choices[0]?.message?.content || 'No analysis available.';
  } catch (error) {
    console.error('OpenAI API Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to analyze image with OpenAI.');
  }
};
