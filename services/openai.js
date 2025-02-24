// services/openai.js
import axios from 'axios';
import { API_URL } from '../config';


export async function analyzeImageProxy(base64DataUrl) {
  try {
    const body = { imageData: base64DataUrl };

    const response = await axios.post(`${API_URL}/analyze`, body, {
      // You can add a token or custom headers if you want
      headers: {
        "Content-Type": "application/json"
      }
    });

    const analysisText = response.data.analysis;
    return analysisText;
  } catch (err) {
    console.error('Proxy error:', err?.response?.data || err.message);
    throw new Error('Proxy analysis failed');
  }
}
