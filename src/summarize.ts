import fs from 'node:fs/promises';
import path from 'node:path';

import { openai } from './lib/openai.js';
import { splitTextByTokenLength } from './lib/tokenizor.js';

const MAX_TOKEN_LEN = 15000; // 16k but 15k to be safe

const SYSTEM_PROMPT = `
Your job is to summarize well so that the reader gets the same understanding as when they read the original.
You must provide a summary that is concise and clear.
Remain neutral and objective.

When you share your summarized text with others, write as if you were a presenter.
For example, you have to write it as if you were sharing it in conference.

Include all necessary information to convey context.

Do not include the text label or prompt in your summary.
Just summarize the text and send it back to me.
`;

const filePath = path.join(
  process.cwd(),
  'data/output/2023-07-04/andrew-clark-whats-next-for-react-reactnext-2016.md'
);
const mockText = await fs.readFile(filePath, 'utf-8');

export async function summarize(text: string = mockText, language = 'Korean') {
  process.stdout.write('splitting text by token length...\n\n');
  const texts = splitTextByTokenLength(text, MAX_TOKEN_LEN);
  process.stdout.write('splitting text by token length Done!\n\n');

  const results: string[] = [];
  for (let i = 0; i < texts.length; i++) {
    const targetText = texts[i];

    process.stdout.write(`summarizing...`);
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
Summarize the following text in ${language}.

Text: ${targetText}
          `,
        },
      ],
      temperature: 1,
    });

    const percent = (i + 1) / texts.length;
    const summarizedMinutes = (Date.now() - starttime) / 1000 / 60;
    const estimatedTranslateTime = summarizedMinutes / percent - summarizedMinutes;

    process.stdout.write(`${(percent * 100).toFixed(2)}% summerized`);
    process.stdout.write(` for: ${summarizedMinutes.toFixed(2)}minutes`);
    process.stdout.write(`, Estimated time left: ${estimatedTranslateTime.toFixed(2)} minutes \n`);

    const result = response.data.choices?.[0].message?.content ?? '';

    results.push(result);
  }

  const summarized = results.join(' ');

  process.stdout.write(`summarizing Done!\n\n`);

  return summarized;
}
