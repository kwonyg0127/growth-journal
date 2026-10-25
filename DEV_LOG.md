# 📘 Growth Journal 개발 일지

## 📅 2026년 10월 25일 (일)
**오늘의 목표:** 
- 가짜 AI 연동 파이프라인 뚫기 및 휠 피커 도입

**✅ 오늘 한 일 (What I did):**
- 깃허브(GitHub)에 내 코드를 처음으로 업로드(Push) 완료함. (충돌 해결 경험)
- 가짜 AI 채팅 함수(`parseFakeAI`)를 만들어서 일정 추가 흐름 테스트 완료.
- 시간 입력을 `TextInput`에서 휠 피커(`TimePickerModal`)로 변경하여 UX 개선.
- 일정 추가 시 카테고리를 강제하지 않고, 일단 '기타'로 저장하게 변경.

**💡 오늘 배운 핵심 (What I learned):**
- **`@` 기호의 의미:** `@`는 이전 폴더가 아니라, `tsconfig.json`에 설정된 `src` 폴더를 가리키는 지름길이다.
- **`_layout.tsx`의 역할:** 앱이 켜질 때 가장 먼저 실행되며, 다크모드 테마와 하단 탭 바(`<AppTabs />`)를 화면에 붙여주는 뼈대다.
- **`export default`:** 파일 밖으로 가장 대표적인 부품(함수)을 내보내는 명령어다.

**🐞 에러 및 해결 (Troubleshooting):**
- **에러:** `git push` 시 "Updates were rejected" 발생.
- **해결:** `git pull --allow-unrelated-histories`로 깃허브에 있는 설명서를 먼저 합친 후 다시 push 했다.

**🎯 내일의 목표 (Next Step):**
- `src/app/index.tsx` (캘린더 탭) 코드 읽고 이해하기.