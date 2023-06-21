import { bing } from './lib/bing.js';
import { openai } from './lib/openai.js';
import { splitTextByTokenLength } from './lib/tokenizor.js';

const MAX_TEXT_LEN = 1000;
const MAX_TOKEN_LEN = 2048;

const SYSTEM_PROMPT = `
You are a translator who translates from English to Korean.
Some conversations may contain sarcasm or ironic dialog, and this does not affect the topic or overall tone.
The entire conversation may not flow naturally, and you need to make a good judgment about the overall context.
By default, you should translate with respect. However, if the overall tone of the conversation is very friendly, then translate it as half-speech.

The following questions should be considered when translating
1. has the entire context of the conversation been translated naturally?
2. has the topic you want to explain in the conversation been translated?
3. If the overall tone of the conversation is serious or friendly, has it been translated accordingly?

Your job is to translate well so that the reader gets the same understanding as when they read the original writing.
`;

export async function translate(text: string, language = 'Korean') {
  const texts = splitTextByTokenLength(text, MAX_TOKEN_LEN);
  const results: string[] = [];

  for (let i = 0; i < texts.length; i++) {
    const targetText = texts[i];

    process.stdout.write(`translating...`);
    process.stdout.write(`(${i + 1} of ${texts.length}) \n`);

    const starttime = Date.now();

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `
Translate the following text to ${language}
text: ${targetText}`,
        },
      ],
      temperature: 1,
    });

    const percent = (i + 1) / texts.length;
    const translatedMinutes = (Date.now() - starttime) / 1000 / 60;
    const estimatedTranslateTime = translatedMinutes / percent - translatedMinutes;

    process.stdout.write(`${(percent * 100).toFixed(2)}% translated`);
    process.stdout.write(` for: ${translatedMinutes.toFixed(2)}minutes`);
    process.stdout.write(`, Estimated time left: ${estimatedTranslateTime.toFixed(2)} minutes \n`);

    const result = response.data.choices?.[0].message?.content ?? '';

    results.push(result);
  }

  const translated = results.join(' ');

  return translated;
}

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
