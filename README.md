Haaaaard worker!

## motivation

- 영어를 어느정도 읽을 순 있지만 듣는데에는 한계가 분명히 있기 때문에,
- 제대로 맥락을 이해하기 위해서는 한국어를 들을 때보다 최소 2배 이상의 시간을 들여야,
- AI 성능이 최근에 엄청나게 발전되어,

## input

- 유투브 영상이 주 대상
- 그 외 mp4 등이 될 수도 있음

## output

- 전체 스피치를 텍스트로 번역한 스크립트
- 맥락이 자연스러운 스크립트
- 한글로 번역된 스크립트

## stack

- nodejs + typescript
- openai api (whisper)
  - https://platform.openai.com/docs/guides/speech-to-text
- translator
  - _later: DeepL_

## process

1. 유투브 영상을 다운로드  
   nodejs
2. 영상(음성)을 텍스트로 변환
3. 영문(주로 영문)을 한글로 번역
4. 한글로 번역된 텍스트를 파일로 저장
   github actions를 통해 저장소를 이용함
