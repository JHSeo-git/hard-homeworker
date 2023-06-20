import { bing } from './lib/bing.js';
import { openai } from './lib/openai.js';
import { splitTextByTokenLength } from './lib/tokenizor.js';

const MAX_TEXT_LEN = 1000;
const MAX_TOKEN_LEN = 2048;

export async function translateBing(text: string) {
  const results = [];

  for (let i = 0; i < text.length; i += MAX_TEXT_LEN) {
    const substringForText = text.substring(i, i + MAX_TEXT_LEN);
    const substringTranslated = await bing.translate({
      text: substringForText,
      to: 'ko',
    });
    results.push(substringTranslated);
  }

  const translated = results.join();

  console.log(results.join(' '));

  return translated;
}

export async function translate(text: string, language = 'Korean') {
  const texts = splitTextByTokenLength(text, MAX_TOKEN_LEN);
  const results: string[] = [];

  for (const text of texts) {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that translates text',
        },
        {
          role: 'user',
          content: `Translate the following 'English' text to '${language}': '''${text}'''`,
        },
      ],
    });

    const result = response.data.choices?.[0].message?.content ?? '';

    results.push(result);
  }

  const translated = results.join(' ');

  return translated;
}
