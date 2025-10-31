import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const salt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash('admin123', salt);
  const restPass = await bcrypt.hash('rest123', salt);
  const ngoPass = await bcrypt.hash('ngo123', salt);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@leftover.link',
      name: 'Admin User',
      passwordHash: adminPass,
      phone: '+1000000000',
      role: 'ADMIN',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  // Create Restaurants
  const rest1 = await prisma.user.create({
    data: {
      email: 'pizzapalace@test.com',
      name: 'Pizza Palace',
      passwordHash: restPass,
      phone: '+1111111111',
      role: 'RESTAURANT',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  const rest2 = await prisma.user.create({
    data: {
      email: 'sushidream@test.com',
      name: 'Sushi Dream',
      passwordHash: restPass,
      phone: '+1222222222',
      role: 'RESTAURANT',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  // Create NGOs
  const ngo1 = await prisma.user.create({
    data: {
      email: 'foodhelpers@test.com',
      name: 'Food Helpers Org',
      passwordHash: ngoPass,
      phone: '+1333333333',
      role: 'NGO',
      emailVerified: true,
      phoneVerified: true,
      reputation: 10,
      registrationDocUrl: '/uploads/fake_doc_pending.pdf', // Pending NGO
    },
  });

  const ngo2 = await prisma.user.create({
    data: {
      email: 'communitykitchen@test.com',
      name: 'Community Kitchen',
      passwordHash: ngoPass,
      phone: '+1444444444',
      role: 'NGO',
      emailVerified: true,
      phoneVerified: true,
      reputation: 50,
      registrationDocUrl: '/uploads/fake_doc_verified.pdf', // This one is seeded as verified for demo
    },
  });

  // Create Donations
  await prisma.donation.createMany({
    data: [
      {
        restaurantId: rest1.id,
        items: JSON.stringify([{ name: 'Pepperoni Pizza', quantity: '10 slices' }, { name: 'Salad', quantity: '5 boxes' }]),
        portions: 15,
        pickupStart: new Date(Date.now() + 3600 * 1000), // 1 hour from now
        pickupEnd: new Date(Date.now() + 3600 * 1000 * 3), // 3 hours from now
        location: JSON.stringify({ lat: 40.7128, lng: -74.0060, address: "123 Pizza St, NY" }),
        images: ['/uploads/fake_pizza.jpg'],
        status: 'AVAILABLE',
      },
      {
        restaurantId: rest2.id,
        items: JSON.stringify([{ name: 'Sushi Rolls', quantity: '50 pieces' }]),
        portions: 25,
        pickupStart: new Date(Date.now() + 3600 * 1000 * 2), // 2 hours from now
        pickupEnd: new Date(Date.now() + 3600 * 1000 * 5), // 5 hours from now
        location: JSON.stringify({ lat: 40.730, lng: -73.935, address: "456 Sushi Ave, NY" }),
        images: ['/uploads/fake_sushi.jpg'],
        status: 'AVAILABLE',
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });