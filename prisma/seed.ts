import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';
import { BOOKS } from '../src/data/books';

const prisma = new PrismaClient();

async function main() {
  // -- Guides du catalogue --
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

  // Dépublie les ebooks qui ne sont plus au catalogue (ex. éditions anglaises
  // retirées en attendant la traduction complète du site).
  const slugs = BOOKS.map((b) => b.slug);
  const removed = await prisma.ebook.updateMany({
    where: { slug: { notIn: slugs }, isPublished: true },
    data: { isPublished: false },
  });
  if (removed.count > 0) console.log(`↩ ${removed.count} guide(s) hors catalogue dépublié(s).`);

  // -- Compte administrateur (backend) --
  const adminEmail = process.env.ADMIN_EMAIL ?? 'emilie@labibliotheque.ca';
  const adminPass = process.env.ADMIN_PASSWORD ?? 'ChangeMoi2026!';
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Emilie Cauvier',
      passwordHash: await bcrypt.hash(adminPass, 10),
      role: 'ADMIN',
    },
  });
  console.log(`✓ Admin : ${adminEmail} / ${adminPass}`);

  // -- Compte démo à accès illimité (abonnement actif, tous les guides) --
  const demoEmail = process.env.DEMO_EMAIL ?? 'demo@labibliotheque.ca';
  const demoPass = process.env.DEMO_PASSWORD ?? 'AccesIllimite2026!';
  await prisma.user.upsert({
    where: { email: demoEmail },
    update: { subscriptionStatus: 'ACTIVE', currentPeriodEnd: new Date('2099-12-31') },
    create: {
      email: demoEmail,
      name: 'Accès illimité',
      passwordHash: await bcrypt.hash(demoPass, 10),
      role: 'USER',
      subscriptionStatus: 'ACTIVE',
      currentPeriodEnd: new Date('2099-12-31'),
    },
  });
  console.log(`✓ Accès illimité : ${demoEmail} / ${demoPass}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
