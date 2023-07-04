import 'dotenv/config';

import { Configuration, OpenAIApi } from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in '.env'");
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  baseOptions: {
    maxBodyLength: 25 * 1024 * 1024,
  },
});

const openai = new OpenAIApi(configuration);

export { openai };
