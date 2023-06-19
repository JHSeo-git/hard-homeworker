export function splitTextIntoSentences(text: string) {
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
