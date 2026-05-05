import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB } from '../config/database';
import { ArtistCategoryModel } from '../modules/artists/models/artist-category.model';

const DEFAULT_CATEGORIES = [
  'Singer',
  'Live Band',
  'DJ',
  'Anchor',
  'Folk Singer',
  'Instrumentalist',
  'Guest Appearance',
  'Celebrity',
  'Solo Singer',
  'Model',
];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const seedCategories = async () => {
  try {
    await connectDB();
    console.log('[SEED] Connected to MongoDB.');

    let addedCount = 0;

    for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
      const name = DEFAULT_CATEGORIES[i];
      const slug = slugify(name);

      const existing = await ArtistCategoryModel.findOne({
        $or: [{ name }, { slug }],
      });

      if (!existing) {
        await ArtistCategoryModel.create({
          name,
          slug,
          isActive: true,
          sortOrder: i * 10, // increments of 10 for easier reordering later
          description: `Default category for ${name}`,
        });
        console.log(`[SEED] Created category: ${name}`);
        addedCount++;
      } else {
        console.log(`[SEED] Category already exists: ${name}`);
      }
    }

    console.log(`[SEED] Completed. Added ${addedCount} new categories.`);
    process.exit(0);
  } catch (error) {
    console.error('[SEED] Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
