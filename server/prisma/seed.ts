import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Admin User
  const email = 'admin@example.com';
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role: 'ADMIN'
    }
  });

  console.log({ admin });

  // 2. Create Pages
  await prisma.page.upsert({
    where: { key: 'ABOUT' },
    update: {},
    create: {
      key: 'ABOUT',
      title: 'About Us',
      contentHtml: '<p>Welcome to Relic Lanka Tours. We are dedicated to...</p>'
    }
  });

  await prisma.page.upsert({
    where: { key: 'CONTACT' },
    update: {},
    create: {
      key: 'CONTACT',
      title: 'Contact Us',
      contentHtml: '<p>Contact us at info@reliclankatours.com</p>'
    }
  });

  // 3. Create Sample Tour
  const tourName = 'Sri Lanka Heritage Tour';
  const tourSlug = slugify(tourName, { lower: true });

  const tour = await prisma.tour.upsert({
    where: { slug: tourSlug },
    update: {},
    create: {
      name: tourName,
      slug: tourSlug,
      shortDescription: 'A 10-day journey through the cultural triangle.',
      description: 'Full description of the heritage tour...',
      days: 10,
      nights: 9,
      inclusion: ['Airport Transfer', 'Breakfast', 'Guide'],
      includedActivities: ['Sigiriya Climb', 'Kandy Temple'],
      isPublished: true,
      itineraryDays: {
        create: [
            { dayNumber: 1, title: 'Arrival', routeText: 'Airport > Negombo', details: 'Relax at the hotel.' },
            { dayNumber: 2, title: 'To Sigiriya', routeText: 'Negombo > Sigiriya', details: 'Climb the lion rock.' }
        ]
      },
      destinations: {
        create: [
            { name: 'Sigiriya', slug: 'sigiriya', description: 'Ancient rock fortress.', sortOrder: 1 },
            { name: 'Kandy', slug: 'kandy', description: 'Hill capital.', sortOrder: 2 }
        ]
      }
    }
  });

  console.log({ tour });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
