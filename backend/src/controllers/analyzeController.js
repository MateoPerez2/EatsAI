// src/controllers/analyzeController.js
const openai = require('../utils/openai'); // Ensure this path is correct

exports.analyzeImage = async (req, res) => {
  try {
    const { image, detail } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    // Construct the message array as per OpenAI's Vision API documentation
    const messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Please analyze this image and give your best estimate on how many calories are in that meal' },
          {
            type: 'image_url',
            image_url: {
              url: image, // This should be in the format 'data:image/jpeg;base64,<base64-data>'
              detail: detail || 'auto', // Default to 'auto' if not provided
            },
          },
        ],
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Ensure this model supports vision
      messages: messages,
      max_tokens: 500, // Adjust as needed
    });

    // Extract the relevant response from OpenAI
    const analysis = response.choices[0].message.content;

    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error in analyzeImage:', error);

    // Check if OpenAI provided an error response
    if (error.response) {
      console.error('OpenAI API Error:', error.response.status, error.response.data);
      return res.status(error.response.status).json({ error: error.response.data.error.message });
    }

    res.status(500).json({ error: 'Failed to analyze image.' });
  }
};
