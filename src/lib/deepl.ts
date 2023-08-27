import * as deepl from 'deepl-node';

if (!process.env.DEEPL_API_KEY) {
  throw new Error("DEEPL_API_KEY is not set in '.env'");
}

const deeplTranslator = new deepl.Translator(process.env.DEEPL_API_KEY);

const convertToTargetLanguage = (language: string) => {
  let targetLanguage: deepl.TargetLanguageCode = 'en-US';

  switch (language.toUpperCase()) {
    case 'KOREAN':
    case 'KOREA':
    case 'KO':
    case 'KR':
    case 'KO-KR':
      targetLanguage = 'ko';
      break;
    case 'ENGLISH':
    case 'EN':
    case 'EN-US':
      targetLanguage = 'en-US';
      break;
    case 'EN-UB':
      targetLanguage = 'en-GB';
      break;
    case 'CHINESE':
    case 'CHINA':
    case 'ZH':
    case 'CN':
    case 'ZH-CN':
      targetLanguage = 'zh';
      break;
    case 'JAPANESE':
    case 'JAPAN':
    case 'JA':
    case 'JP':
    case 'JA-JP':
      targetLanguage = 'ja';
      break;
    default:
      break;
  }

  return targetLanguage;
};

export { deeplTranslator, convertToTargetLanguage };
