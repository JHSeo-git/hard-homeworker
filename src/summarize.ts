import fs from 'node:fs/promises';
import path from 'node:path';

import { openai } from './lib/openai.js';
import { splitTextByTokenLength } from './lib/tokenizor.js';

const MAX_TOKEN_LEN = 16000; // 16k

const SYSTEM_PROMPT = `
The total length of the content that I want to send you is too large to send in only one piece.
For sending you that content, I will follow this rule:
[START PART 1/5]
this is the content of the part 1 out of 5 in total
[END PART 1/5]
And when I tell you "ALL PARTS SENT", then you can continue processing the data and answering my requests.

The processing is summarizing the text into a short summary.

When summarizing, you should consider the following instructions:
1. Summarize to the same language used in the content.
2. Be sure to include a topic and important information.
3. Write it as easy as possible as if you are explaining to a beginning software engineer.
4. Write it as if you were sharing this summarized text with someone.

Do not include the text label or prompt in your summary.
Just summarize the text and send it back to me.

Remember to write the summary in the same language as the content.
`;

const END_PROMPT = `
ALL PARTS SENT
`;

const filePath = path.join(
  process.cwd(),
  'data/output/2023-07-04/andrew-clark-whats-next-for-react-reactnext-2016.md'
);
const mockText = await fs.readFile(filePath, 'utf-8');

const getPrompt = (text: string, process: string) =>
  `
[START PART ${process}]
${text}
[END PART ${process}]
`;

function getProcessingPrompt(text: string, currIndex: number, total: number) {
  const curr = `${currIndex}/${total}`;

  if (currIndex === total) {
    return `${getPrompt(text, curr)} ${END_PROMPT}`;
  }

  return `
Do not answer yet. This is just another part of the text I want to send you.
Just receive and wait for the next part.
${getPrompt(text, curr)}
Remember not answering yet. Just receive and wait for the next part.
`;
}

export async function summarize(text: string = mockText) {
  process.stdout.write('splitting text by token length...\n\n');
  const texts = splitTextByTokenLength(text, MAX_TOKEN_LEN);
  process.stdout.write('splitting text by token length Done!\n\n');

  let result = '';
  for (let i = 0; i < texts.length; i++) {
    const targetText = texts[i];

    process.stdout.write(`summarizing...`);
    process.stdout.write(`(${i + 1} of ${texts.length}) `);

    console.log(getProcessingPrompt(targetText, i + 1, texts.length));

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
          content: getProcessingPrompt(targetText, i + 1, texts.length),
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

    result = response.data.choices?.[0].message?.content ?? '';
  }

  process.stdout.write(`summarizing Done!\n\n`);

  return result;
}
