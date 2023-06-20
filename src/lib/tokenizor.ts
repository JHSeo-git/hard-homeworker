import { get_encoding } from '@dqbd/tiktoken';

const ENCODING = 'cl100k_base';

function getTokenLength(text: string) {
  const encoder = get_encoding(ENCODING);
  const tokens = encoder.encode(text);
  const length = tokens.length;
  encoder.free();

  return length;
}

export function splitTextByTokenLength(text: string, length: number) {
  const texts = [];
  const sentences = splitTextIntoSentences(text);
  const lastSentence = sentences.reduce((prev, curr) => {
    const sentence = `${prev} ${curr}`.trim();
    const tokenLength = getTokenLength(sentence);
    if (tokenLength > length) {
      texts.push(prev);
      return curr.trim();
    }
    return sentence;
  }, '');
  texts.push(lastSentence);

  return texts;
}

function splitTextIntoSentences(text: string) {
  const delimiters = ['.', '!', '?']; // 문장 구분자로 사용할 문자들
  const sentences = [];
  let sentence = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    sentence += char;

    if (delimiters.includes(char)) {
      sentences.push(sentence.trim());
      sentence = '';
    }
  }

  if (sentence.trim().length > 0) {
    sentences.push(sentence.trim());
  }

  return sentences;
}
