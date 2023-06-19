import fs from 'node:fs';

import { bing } from './lib/bing.js';
import { openai } from './lib/openai.js';
import { getTokenLength } from './lib/tokenizor.js';
import { splitTextIntoSentences } from './lib/utils.js';

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

  console.log(results.join());

  return translated;
}

export async function translate(text: string, language = 'Korean') {
  const sentences = splitTextIntoSentences(text);

  const results = [];

  let sentence = '';
  for (let i = 0; i < sentences.length; i++) {
    sentence = [sentence, sentences[i]].join();

    const length = getTokenLength(sentence);
    if (length > MAX_TOKEN_LEN) {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-16k',
        messages: [
          {
            role: 'system',
            content: `Translate the following text into ${language}:`,
          },
          {
            role: 'user',
            content: text.substring(i, i + MAX_TEXT_LEN),
          },
        ],
      });

      const substringTranslated = response.data.choices?.[0].message ?? '';
      results.push(substringTranslated);

      sentence = '';
    }
  }

  return results.filter(Boolean).join();
}
