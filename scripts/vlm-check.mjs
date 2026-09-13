import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const files = process.argv.slice(2);
const zai = await ZAI.create();
for (const f of files) {
  const b64 = fs.readFileSync(f).toString('base64');
  const res = await zai.chat.completions.createVision({
    messages: [
      { role: 'user', content: [
        { type: 'text', text: 'You are a strict design reviewer. Describe this e-commerce homepage section screenshot: layout, typography, colors, any visual bugs (overlapping text, clipped elements, broken images, misaligned borders, empty areas). Be concise (max 120 words). End with VERDICT: PASS or VERDICT: ISSUES.' },
        { type: 'image_url', image_url: { url: `data:image/png;base64,${b64}` } }
      ]}
    ]
  });
  console.log('=== ' + f.split('/').pop() + ' ===');
  console.log(res.choices[0].message.content.trim().substring(0, 900));
  console.log();
}
