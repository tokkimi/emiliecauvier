import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';
import { BOOKS } from '../src/data/books';

const prisma = new PrismaClient();

async function main() {
  // -- 50 guides --
  for (const b of BOOKS) {
    await prisma.ebook.upsert({
      where: { slug: b.slug },
      update: {
        number: b.number,
        title: b.title,
        subtitle: b.subtitle,
        collection: b.collection,
        language: b.language,
        priceCents: b.priceCents,
        pdfKey: b.pdf,
        isPublished: true,
      },
      create: {
        slug: b.slug,
        number: b.number,
        title: b.title,
        subtitle: b.subtitle,
        description: b.subtitle,
        collection: b.collection,
        language: b.language,
        priceCents: b.priceCents,
        pdfKey: b.pdf,
        isPublished: true,
        includedInSubscription: true,
      },
    });
  }
  console.log(`✓ ${BOOKS.length} guides importés.`);

  // -- Compte administrateur de démo --
  const adminEmail = process.env.ADMIN_EMAIL ?? 'emilie@labibliotheque.ca';
  const adminPass = process.env.ADMIN_PASSWORD ?? 'ChangeMoi2026!';
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Émilie Cauvier',
      passwordHash: await bcrypt.hash(adminPass, 10),
      role: 'ADMIN',
    },
  });
  console.log(`✓ Admin : ${adminEmail} / ${adminPass}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
