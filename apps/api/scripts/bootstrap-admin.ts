
import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!connectionString || !password) {
    throw new Error(
      'DATABASE_URL and BOOTSTRAP_ADMIN_PASSWORD must be set.',
    );
  }

  const databaseUrl = new URL(connectionString);

  // This script is intentionally restricted to the local development DB.
  if (
    !['localhost', '127.0.0.1'].includes(databaseUrl.hostname) ||
    databaseUrl.port !== '5433' ||
    databaseUrl.pathname !== '/relayai'
  ) {
    throw new Error(
      'Refusing to run: expected the local relayai database on port 5433.',
    );
  }

  if (Buffer.byteLength(password, 'utf8') < 12 ||
      Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('Password must be between 12 and 72 UTF-8 bytes.');
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    await prisma.$connect();

    const name = (await rl.question('Admin name: ')).trim();
    const email = (await rl.question('Admin email: ')).trim().toLowerCase();
    const confirmation = await rl.question(
      'Type CREATE FIRST ADMIN to continue: ',
    );

    if (confirmation !== 'CREATE FIRST ADMIN') {
      throw new Error('Confirmation did not match; no account created.');
    }

    if (name.length < 2 || name.length > 100) {
      throw new Error('Name must be between 2 and 100 characters.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      throw new Error('Enter a valid email address.');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction(async (tx) => {
      // Serialize bootstrap attempts so two simultaneous runs cannot
      // both pass the first-admin check.
      await tx.$queryRaw`
  SELECT pg_advisory_xact_lock(731904281)::text AS locked
`;

      const existingAdmin = await tx.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true },
      });

      if (existingAdmin) {
        throw new Error(
          'An admin already exists. Bootstrap is first-admin only.',
        );
      }

      const existingEmail = await tx.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingEmail) {
        throw new Error(
          'That email already belongs to an account. No account was changed.',
        );
      }

      await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'ADMIN',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    });

    console.log(`First admin created: ${email}`);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : 'Admin bootstrap failed.',
  );
  process.exitCode = 1;
});
