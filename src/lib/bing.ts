import type { lang } from 'bing-translate-api';
import { translate } from 'bing-translate-api';

interface BingTranslateParams {
  text: string;
  to: keyof typeof lang.LANGS;
}

const bing = {
  translate: async ({ text, to }: BingTranslateParams) => {
    const result = await translate(text, null, to);

    return result.translation;
  },
};

export { bing };
