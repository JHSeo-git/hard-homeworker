import { bing } from './lib/bing.js';
import { openai } from './lib/openai.js';
import { splitTextByTokenLength } from './lib/tokenizor.js';

const MAX_TEXT_LEN = 1000;
const MAX_TOKEN_LEN = 2048;

const SYSTEM_PROMPT = `
Your job is to translate well so that the reader gets the same understanding as when they read the original.
You need to translate so that the content doesn't sound strange when read by a native speaker of the translation language.
By default, you should translate with formal words, but it's okay to translate with informal words if the overall tone of the conversation is very friendly.
By default, you should translate with a honorific word, but it's okay to translate with a casually word. if the overall tone of the conversation is very friendly. You should translate with a consistent(a honorific word, a casually word) tone throughout the entire conversation.
Some conversations may contain sarcasm or humorous codes that don't affect the topic or overall tone.
Even if the entire conversation doesn't sound natural, you still need to understand the overall context.

When translating, you should consider the following questions
1. Does the translation reflect the overall tone of the conversation (serious, friendly, etc.)?
2. Does the translation sound natural and smooth, like a human talking to a human?

Do not include the text label or prompt in your translation.
`;

export async function translate(text: string, language = 'Korean') {
  process.stdout.write('splitting text by token length...\n\n');
  const texts = splitTextByTokenLength(text, MAX_TOKEN_LEN);
  process.stdout.write('splitting text by token length Done!\n\n');

  const results: string[] = [];

  for (let i = 0; i < texts.length; i++) {
    const targetText = texts[i];

    process.stdout.write(`translating...`);
    process.stdout.write(`(${i + 1} of ${texts.length}) `);

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

Text: ${targetText}
`,
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

  process.stdout.write(`translating Done!\n\n`);

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

  return translated;
}
