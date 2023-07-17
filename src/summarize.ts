import { openai } from './lib/openai.js';
import { getTokenLength, splitTextByTokenLength } from './lib/tokenizor.js';

const SYSTEM_PROMPT = `
Your task is to summarize and explain the video transcript provided.
You need to provide a concise and clear summary.
Maintain a neutral and objective demeanor.

Proper nouns, names, etc. should be written verbatim.
Break up your summary into paragraphs if necessary.

Don't include text labels or prompts in your summaries. (e.g. "Text: ")
Just summarize the text and send it back to me.

Use markdown syntax, such as ">" for quotes, "**" for bold text, or "\`" for in-line codes.
`;

export async function summarize(text: string, maxTokenLength: number, language = 'Korean') {
  const texts = splitTextByTokenLength(text, maxTokenLength);

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

Don't forget to write in ${language}!
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

export async function tldr(text: string, maxTokenLength: number, language = 'Korean') {
  if (getTokenLength(text) > maxTokenLength) {
    throw new Error(`The text is too long. The maximum token length is ${maxTokenLength}.`);
  }

  process.stdout.write(`tldr summarizing...\n`);

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
It should be a list of sentences, not a paragraph.
Each sentence begins with "-" (for example, "- This is a sentence.")
Keep the number of sentences to three to best summarize the text.

Summarize the following text in ${language}.

Text: ${text}

Remember that you need to create only three sentence lists.
Don't forget to write in ${language}!
`,
      },
    ],
    temperature: 1,
  });

  const result = response.data.choices?.[0].message?.content ?? '';

  return result;
}
