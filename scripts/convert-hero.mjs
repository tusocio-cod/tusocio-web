import sharp from 'sharp';
import { readdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';

const heroDir = 'public/images/hero';
const files = readdirSync(heroDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

if (files.length === 0) {
  console.log('Nenhum PNG/JPG encontrado em', heroDir);
  process.exit(0);
}

for (const file of files) {
  const input  = join(heroDir, file);
  const output = join(heroDir, basename(file, extname(file)) + '.webp');

  const meta = await sharp(input).metadata();
  console.log(`\n→ ${file}  (${meta.width}×${meta.height})`);

  await sharp(input)
    .webp({ quality: 82, effort: 4 })
    .toFile(output);

  const { size: inSize  } = (await import('fs')).statSync(input);
  const { size: outSize } = (await import('fs')).statSync(output);
  const saving = (((inSize - outSize) / inSize) * 100).toFixed(1);

  console.log(`   ✅ ${output}`);
  console.log(`   ${(inSize/1024/1024).toFixed(2)} MB → ${(outSize/1024/1024).toFixed(2)} MB  (${saving}% menor)`);
}

console.log('\n🎉 Conversão concluída!');
