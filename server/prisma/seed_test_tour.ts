import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.tour.create({
    data: {
      name: 'Sample Luxury Tour',
      slug: 'sample-luxury-tour',
      shortDescription: 'Experience the ultimate luxury.',
      description: 'A detailed description of the tour.',
      days: 5,
      nights: 4,
      price: 150000,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      inclusion: ['Luxury Accommodation', 'Private Transport'],
      includedActivities: ['Spa Treatment', 'Private Dinner'],
      excludes: ['Flights', 'Personal Expenses'],
      complementary: ['Welcome Drink', 'Free WiFi'],
      heroImageUrl: 'https://via.placeholder.com/1200x400',
      isPublished: true,
      itineraryDays: {
        create: [
          {
            dayNumber: 1,
            title: 'Arrival',
            routeText: 'Airport > Hotel',
            details: 'Welcome to paradise.',
            images: [
              'https://via.placeholder.com/150',
              'https://via.placeholder.com/150'
            ]
          }
        ]
      }
    }
  });
  console.log('Test tour created');
}

main().catch(console.error).finally(() => prisma.$disconnect());
