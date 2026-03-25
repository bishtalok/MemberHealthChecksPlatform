import { PrismaClient, JourneyType, JourneyStatus, ResultStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // --- Stores ---
  const storeNottingham = await prisma.store.upsert({
    where: { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
    update: {},
    create: {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      name: 'Boots Nottingham - Victoria Centre',
      address: '15 Victoria Centre',
      city: 'Nottingham',
      postcode: 'NG1 3QA',
      phone: '0115 941 2569',
    },
  });

  const storeLondon = await prisma.store.upsert({
    where: { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
    update: {},
    create: {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      name: 'Boots London - Oxford Street',
      address: '361 Oxford Street',
      city: 'London',
      postcode: 'W1C 2JL',
      phone: '020 7514 1816',
    },
  });

  // --- Slots for next 7 days ---
  const stores = [storeNottingham, storeLondon];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const store of stores) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);

      // Skip weekends
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      // 9am to 5pm, 30-min slots
      for (let hour = 9; hour < 17; hour++) {
        for (let min = 0; min < 60; min += 30) {
          const start = new Date(date);
          start.setHours(hour, min, 0, 0);

          const end = new Date(start);
          end.setMinutes(end.getMinutes() + 30);

          await prisma.slot.create({
            data: {
              store_id: store.id,
              start_time: start,
              end_time: end,
              capacity: 1,
              booked: 0,
            },
          });
        }
      }
    }
  }

  // --- Demo Member ---
  const demoMember = await prisma.member.upsert({
    where: { insurer_member_id: 'VTL-12345' },
    update: {},
    create: {
      id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      insurer_member_id: 'VTL-12345',
      insurer_code: 'vitality',
      first_name: 'Sarah',
      last_name: 'Williams',
      email: 'sarah.williams@example.com',
      date_of_birth: new Date('1984-06-15'),
      consent_given_at: new Date(),
      consent_version: '1.0',
    },
  });

  // --- Demo Completed Journey ---
  const demoJourney = await prisma.healthCheckJourney.create({
    data: {
      id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
      member_id: demoMember.id,
      journey_type: JourneyType.FULL,
      status: JourneyStatus.COMPLETED,
      pre_assessment: {
        q1: 'moderate',
        q2: 'no',
        q3: 5,
        q4: 'none',
        q5: 'no',
      },
    },
  });

  // --- Demo Results ---
  await prisma.result.createMany({
    data: [
      {
        journey_id: demoJourney.id,
        metric: 'Systolic Blood Pressure',
        value: 128,
        unit: 'mmHg',
        status: ResultStatus.BORDERLINE,
        pharmacist_id: 'pharmacist-001',
      },
      {
        journey_id: demoJourney.id,
        metric: 'Diastolic Blood Pressure',
        value: 82,
        unit: 'mmHg',
        status: ResultStatus.NORMAL,
        pharmacist_id: 'pharmacist-001',
      },
      {
        journey_id: demoJourney.id,
        metric: 'Total Cholesterol',
        value: 5.2,
        unit: 'mmol/L',
        status: ResultStatus.BORDERLINE,
        pharmacist_id: 'pharmacist-001',
      },
      {
        journey_id: demoJourney.id,
        metric: 'Blood Glucose',
        value: 5.0,
        unit: 'mmol/L',
        status: ResultStatus.NORMAL,
        pharmacist_id: 'pharmacist-001',
      },
      {
        journey_id: demoJourney.id,
        metric: 'BMI',
        value: 24.5,
        unit: 'kg/m²',
        status: ResultStatus.NORMAL,
        pharmacist_id: 'pharmacist-001',
      },
    ],
  });

  console.log('Seed complete!');
  console.log(`  Stores: ${stores.length}`);
  console.log(`  Demo member: ${demoMember.insurer_member_id}`);
  console.log(`  Demo journey: ${demoJourney.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
