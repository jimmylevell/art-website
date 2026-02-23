import type { Core } from '@strapi/strapi';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Seed data on bootstrap if the collection has fewer than 10 items
    const count = await strapi.documents('api::art-piece.art-piece').count({});

    if (count < 10) {
      console.log(`Found ${count} art pieces. Seeding database with test data...`);
      await seedArtPieces(strapi);
    } else {
      console.log(`Database already has ${count} art pieces. Skipping seed.`);
    }
  },
};

async function seedArtPieces(strapi: Core.Strapi) {
  const artPieces = [
    {
      title: 'Sunset Dreams',
      description: 'A beautiful abstract painting capturing the essence of a sunset with vibrant orange and purple hues.',
      category: 'Paintings',
      color: '#FF6B6B',
    },
    {
      title: 'Ocean Waves',
      description: 'An impressionist painting depicting the dynamic movement of ocean waves crashing on the shore.',
      category: 'Paintings',
      color: '#4ECDC4',
    },
    {
      title: 'Mountain Peak',
      description: 'A realistic landscape painting showcasing a majestic mountain peak covered in snow.',
      category: 'Paintings',
      color: '#45B7D1',
    },
    {
      title: 'Modern Form',
      description: 'A contemporary sculpture made of bronze, exploring geometric shapes and negative space.',
      category: 'Sculptures',
      color: '#96CEB4',
    },
    {
      title: 'Dancing Figure',
      description: 'An expressive sculpture capturing the grace and movement of a dancer in mid-motion.',
      category: 'Sculptures',
      color: '#FFEAA7',
    },
    {
      title: 'Abstract Cube',
      description: 'A minimalist steel sculpture featuring clean lines and a reflective surface.',
      category: 'Sculptures',
      color: '#DFE6E9',
    },
    {
      title: 'Cyber Landscape',
      description: 'A digital artwork depicting a futuristic cityscape with neon lights and holographic displays.',
      category: 'Digital Art',
      color: '#A29BFE',
    },
    {
      title: 'Fractal Dreams',
      description: 'An intricate digital composition based on mathematical fractals and vibrant color gradients.',
      category: 'Digital Art',
      color: '#FD79A8',
    },
    {
      title: 'Pixel Universe',
      description: 'A retro-inspired digital piece combining pixel art aesthetics with cosmic themes.',
      category: 'Digital Art',
      color: '#FDCB6E',
    },
    {
      title: 'Urban Symphony',
      description: 'A mixed media piece capturing the vibrant energy and rhythm of city life at night.',
      category: 'Paintings',
      color: '#6C5CE7',
    },
  ];

  for (const piece of artPieces) {
    try {
      // Create SVG placeholder image
      const svg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="${piece.color}"/>
        <text x="300" y="200" font-size="40" fill="white" text-anchor="middle">${piece.title}</text>
      </svg>`;

      const buffer = Buffer.from(svg);
      const filename = `${piece.title.toLowerCase().replace(/\s+/g, '-')}.svg`;
      const tempPath = path.join(os.tmpdir(), filename);
      fs.writeFileSync(tempPath, buffer);

      // Create file entry directly using query API
      const fileEntry = await strapi.query('plugin::upload.file').create({
        data: {
          name: filename,
          alternativeText: piece.title,
          caption: piece.title,
          ext: '.svg',
          mime: 'image/svg+xml',
          size: buffer.length / 1024, // size in KB
          url: `/uploads/${filename}`,
          provider: 'local',
        },
      });

      // Copy file to uploads directory
      const uploadsDir = path.join(__dirname, '../../public/uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.copyFileSync(tempPath, path.join(uploadsDir, filename));
      fs.unlinkSync(tempPath);

      // Create the art piece with the uploaded image
      await strapi.documents('api::art-piece.art-piece').create({
        data: {
          title: piece.title,
          description: piece.description,
          category: piece.category,
          image: fileEntry.id,
          publishedAt: new Date(),
        },
      });

      console.log(`✓ Created: ${piece.title}`);
    } catch (error) {
      console.error(`✗ Failed to create "${piece.title}":`, error.message);
    }
  }

  console.log('✓ Seeding complete!');
}

