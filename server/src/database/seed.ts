import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { roles, users, students } from './schema';

dotenv.config();

const adminUser = {
  name: 'Super Admin',
  email: 'admin@example.com',
  password: 'admin123',
  roleId: 1, // admin role
};

const teacherUser = {
  name: 'John Teacher',
  email: 'teacher@example.com',
  password: 'teacher123',
  roleId: 2, // teacher role
};

function generateNisn(index: number) {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  return `${year}${month}${day}${index.toString().padStart(3, '0')}`;
}

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  const db = drizzle(client);

  try {
    console.log('🌱 Starting database seeding...');

    // Seed roles
    console.log('📝 Seeding roles...');
    await db
      .insert(roles)
      .values([
        { id: 1, name: 'admin' },
        { id: 2, name: 'teacher' },
        { id: 3, name: 'student' },
      ])
      .onConflictDoNothing();

    // Seed admin user
    console.log('👤 Seeding admin user...');
    const hashedAdminPassword = await bcrypt.hash(adminUser.password, 10);
    await db
      .insert(users)
      .values({
        name: adminUser.name,
        email: adminUser.email,
        password: hashedAdminPassword,
        roleId: adminUser.roleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();

    // Seed teacher user
    console.log('👨‍🏫 Seeding teacher user...');
    const hashedTeacherPassword = await bcrypt.hash(teacherUser.password, 10);
    await db
      .insert(users)
      .values({
        name: teacherUser.name,
        email: teacherUser.email,
        password: hashedTeacherPassword,
        roleId: teacherUser.roleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();

    // Seed students
    console.log('🎒 Seeding students...');
    const studentsData = Array.from({ length: 99 }, (_, i) => {
      const nisn = generateNisn(i);
      return {
        nisn,
        name: `Student ${i + 1}`,
        dob: new Date(`2010-03-${(i % 28) + 1}`),
        guardianContact: `student${i + 1}@example.com`,
        createdAt: new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000),
        updatedAt: new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000),
      };
    });
    await db.insert(students).values(studentsData).onConflictDoNothing();

    console.log('✅ Database seeding completed successfully!');
    console.log('📋 Default accounts:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   Teacher: teacher@example.com / teacher123');
    console.log('   Student role seeded (no default user)');
    console.log('   Demo students seeded (100 records)');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.end();
  }
}

seed();
