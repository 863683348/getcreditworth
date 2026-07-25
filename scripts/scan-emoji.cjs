const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/u;
const fs = require('fs');

const filesToCheck = [
  'components/HomeContent.tsx',
  'components/BookDetailContent.tsx',
  'components/layout/Header.tsx',
  'lib/i18n/en.ts',
  'lib/i18n/zh.ts',
  'lib/utils/affiliate.ts',
];

let violations = 0;
filesToCheck.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (emojiRegex.test(line)) {
      console.log('EMOJI FOUND: ' + f + ':' + (idx + 1) + ': ' + line.trim().substring(0, 100));
      violations++;
    }
  });
});

if (violations === 0) {
  console.log('P0-1 emoji scan: 0 violations in ' + filesToCheck.length + ' files');
} else {
  console.log('Found ' + violations + ' emoji violations');
  process.exit(1);
}