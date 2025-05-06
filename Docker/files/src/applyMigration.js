import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

async function applyMigration() {
    try {
        const migrationSQL = readFileSync('./migration.sql', 'utf-8');

        // Split SQL commands (ensure it works for multiple lines)
        const statements = migrationSQL
            .split(/;\s*$/m) // Split on semicolon at end of a line
            .map(stmt => stmt.trim()) // Trim spaces
            .filter(stmt => stmt.length > 0); // Remove empty queries

        for (const statement of statements) {
            console.log(`Executing: ${statement}`);
            await prisma.$executeRawUnsafe(`${statement};`); // Ensure semicolon for execution
        }

        console.log('Migration applied successfully!');
    } catch (error) {
        console.error('Error applying migration:', error);
    } finally {
        await prisma.$disconnect();
    }
}

applyMigration();
