import express from 'express';
import axios from 'axios';
import FormData from 'form-data';

const router = express.Router();

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_API_URL = 'https://api.stability.ai/v2beta/stable-image/generate/core';

router.route('/').get((req, res) => {
  res.send("Hello from Stability AI");
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const payload = {
      prompt,
      output_format: "jpeg"
    };

    const response = await axios.postForm(
      STABILITY_API_URL,
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: "image/*"
        },
      }
    );

    if (response.status === 200) {
      const base64Image = Buffer.from(response.data).toString('base64');
      res.status(200).json({ photo: base64Image });
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error('Error generating image:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
