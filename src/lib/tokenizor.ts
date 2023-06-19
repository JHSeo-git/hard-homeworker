import { get_encoding } from '@dqbd/tiktoken';

const ENCODING = 'cl100k_base';

export function getTokenLength(text: string) {
  const encoder = get_encoding(ENCODING);
  const tokens = encoder.encode(text);
  const length = tokens.length;
  encoder.free();

  return length;
}
