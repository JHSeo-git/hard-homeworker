import { convertToTargetLanguage, deeplTranslator } from './lib/deepl.js';
import { openai } from './lib/openai.js';
import { splitTextByTokenLength } from './lib/tokenizor.js';

const SYSTEM_PROMPT = `
Your job is to translate well so that the reader gets the same understanding as when they read the original.
You need to translate so that the content doesn't sound strange when read by a native speaker of the translation language.
You should translate with formal words, but it's okay to translate with informal words if the overall tone of the conversation is very friendly.
You should translate with a honorific word, but it's okay to translate with a casually word. if the overall tone of the conversation is very friendly. You should translate with a consistent(a honorific word, a casually word) tone throughout the entire conversation.
Some conversations may contain sarcasm or humorous codes that don't affect the topic or overall tone.
Even if the entire conversation doesn't sound natural, you still need to understand the overall context.

When translating, you should consider the following questions
1. Does the translation reflect the overall tone of the conversation (serious, friendly, etc.)?
2. Does the translation sound natural and smooth, like a human talking to a human?

Do not include the text labels or prompts in your translation.
`;

export async function translate(text: string, maxTokenLength: number, language = 'Korean') {
  const texts = splitTextByTokenLength(text, maxTokenLength);

  const results: string[] = [];
  for (let i = 0; i < texts.length; i++) {
    const targetText = texts[i];

    process.stdout.write(`translating...`);
    process.stdout.write(`(${i + 1} of ${texts.length}) `);

    const starttime = Date.now();

    // const result = await translateOnOpenAI(targetText, language);
    const result = await translateOnDeepL(targetText, language);

    const percent = (i + 1) / texts.length;
    const translatedMinutes = (Date.now() - starttime) / 1000 / 60;
    const estimatedTranslateTime = translatedMinutes / percent - translatedMinutes;

    process.stdout.write(`${(percent * 100).toFixed(2)}% translated`);
    process.stdout.write(` for: ${translatedMinutes.toFixed(2)}minutes`);
    process.stdout.write(`, Estimated time left: ${estimatedTranslateTime.toFixed(2)} minutes \n`);

    results.push(result);
  }

  const translated = results.filter(Boolean).join(' ');

  process.stdout.write(`translating Done!\n\n`);

  return translated;
}

async function translateOnOpenAI(text: string, language: string) {
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

Text: ${text}
`,
      },
    ],
    temperature: 0,
  });

  return response.data.choices?.[0].message?.content ?? '';
}

async function translateOnDeepL(text: string, language: string) {
  const targetLanguage = convertToTargetLanguage(language);
  const response = await deeplTranslator.translateText(text, 'en', targetLanguage);

  return response.text ?? '';
}
