const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use body-parser to handle JSON request bodies
app.use(bodyParser.json());

// Serve static HTML page
app.use(express.static('public'));

// Analyze feedback route
app.post('/analyze-feedback', async (req, res) => {
    const feedback = req.body.feedback;
    
    if (!feedback) {
        return res.status(400).json({ error: 'Feedback is required' });
    }

    try {
        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',  // Using GPT-3.5 for better understanding and response
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that can analyze sentiment in text.'
                    },
                    {
                        role: 'user',
                        content: `Please analyze the sentiment of this feedback: "${feedback}".`
                    }
                ],
                max_tokens: 150,
            },
            {
                headers: {
                    'Authorization': `Bearer OPENAI_API_KEY`,  // Replace with your OpenAI API key
					'Content-Type': 'application/json'
                },
            }
        );

        // Parse the response from OpenAI
        const analysis = openaiResponse.data.choices[0].message.content.trim();
        return res.json({ sentimentAnalysis: analysis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong with the analysis' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
