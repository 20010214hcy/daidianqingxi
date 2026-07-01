import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateImagePaths() {
  console.log('🔄 更新数据库中的图片路径...\n');

  // 更新 Article 表
  const articles = await prisma.$queryRaw`
    SELECT id, coverImage FROM Article WHERE coverImage LIKE '%.png' OR coverImage LIKE '%.jpg' OR coverImage LIKE '%.jpeg'
  `;
  for (const article of articles) {
    const newPath = article.coverImage.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    await prisma.article.update({
      where: { id: article.id },
      data: { coverImage: newPath }
    });
    console.log(`✅ Article #${article.id}: ${article.coverImage} → ${newPath}`);
  }

  // 更新 ProjectCase 表
  const cases = await prisma.$queryRaw`
    SELECT id, coverImage, images FROM ProjectCase
    WHERE coverImage LIKE '%.png' OR coverImage LIKE '%.jpg' OR coverImage LIKE '%.jpeg'
       OR images LIKE '%.png' OR images LIKE '%.jpg' OR images LIKE '%.jpeg'
  `;
  for (const c of cases) {
    const updates = {};
    if (c.coverImage && /\.(png|jpg|jpeg)$/i.test(c.coverImage)) {
      updates.coverImage = c.coverImage.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }
    if (c.images) {
      try {
        const imageList = JSON.parse(c.images);
        const newImages = imageList.map(img => img.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
        updates.images = JSON.stringify(newImages);
      } catch {
        updates.images = c.images.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      }
    }
    if (Object.keys(updates).length > 0) {
      await prisma.projectCase.update({
        where: { id: c.id },
        data: updates
      });
      console.log(`✅ Case #${c.id}: 图片路径已更新`);
    }
  }

  // 更新 Service 表
  const services = await prisma.$queryRaw`
    SELECT id, coverImage FROM Service WHERE coverImage LIKE '%.png' OR coverImage LIKE '%.jpg' OR coverImage LIKE '%.jpeg'
  `;
  for (const service of services) {
    const newPath = service.coverImage.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    await prisma.service.update({
      where: { id: service.id },
      data: { coverImage: newPath }
    });
    console.log(`✅ Service #${service.id}: ${service.coverImage} → ${newPath}`);
  }

  // 更新 Product 表
  const products = await prisma.$queryRaw`
    SELECT id, image FROM Product WHERE image LIKE '%.png' OR image LIKE '%.jpg' OR image LIKE '%.jpeg'
  `;
  for (const product of products) {
    const newPath = product.image.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    await prisma.product.update({
      where: { id: product.id },
      data: { image: newPath }
    });
    console.log(`✅ Product #${product.id}: ${product.image} → ${newPath}`);
  }

  // 更新 Certificate 表
  const certificates = await prisma.$queryRaw`
    SELECT id, image FROM Certificate WHERE image LIKE '%.png' OR image LIKE '%.jpg' OR image LIKE '%.jpeg'
  `;
  for (const cert of certificates) {
    const newPath = cert.image.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    await prisma.certificate.update({
      where: { id: cert.id },
      data: { image: newPath }
    });
    console.log(`✅ Certificate #${cert.id}: 图片路径已更新`);
  }

  console.log('\n✨ 数据库更新完成!');
}

updateImagePaths()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
