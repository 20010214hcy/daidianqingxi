import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const UPLOADS_DIR = './public/uploads';
const MAX_WIDTH = 1920;
const QUALITY = 80;

async function optimizeImages() {
  console.log('🖼️  开始优化图片...\n');

  const files = await readdir(UPLOADS_DIR);
  const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of imageFiles) {
    const inputPath = join(UPLOADS_DIR, file);
    const outputPath = join(UPLOADS_DIR, basename(file, extname(file)) + '.webp');

    const inputStat = await stat(inputPath);
    totalBefore += inputStat.size;

    // 跳过已经很小的文件
    if (inputStat.size < 100 * 1024) {
      console.log(`⏭️  跳过 ${file} (${(inputStat.size / 1024).toFixed(0)}KB - 已足够小)`);
      continue;
    }

    try {
      await sharp(inputPath)
        .resize(MAX_WIDTH, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const outputStat = await stat(outputPath);
      totalAfter += outputStat.size;

      const reduction = ((1 - outputStat.size / inputStat.size) * 100).toFixed(1);
      console.log(`✅ ${file} → ${basename(outputPath)}`);
      console.log(`   ${(inputStat.size / 1024 / 1024).toFixed(1)}MB → ${(outputStat.size / 1024 / 1024).toFixed(1)}MB (-${reduction}%)\n`);
    } catch (err) {
      console.error(`❌ 处理 ${file} 失败:`, err.message);
    }
  }

  console.log('='.repeat(50));
  console.log(`📊 优化完成!`);
  console.log(`   原始大小: ${(totalBefore / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   优化后: ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   节省: ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`);
}

optimizeImages().catch(console.error);
