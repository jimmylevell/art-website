const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:1337/api';

// Sample art pieces data
const artPieces = [
  {
    title: 'Sunset Dreams',
    description: 'A beautiful abstract painting capturing the essence of a sunset with vibrant orange and purple hues.',
    category: 'Paintings',
  },
  {
    title: 'Ocean Waves',
    description: 'An impressionist painting depicting the dynamic movement of ocean waves crashing on the shore.',
    category: 'Paintings',
  },
  {
    title: 'Mountain Peak',
    description: 'A realistic landscape painting showcasing a majestic mountain peak covered in snow.',
    category: 'Paintings',
  },
  {
    title: 'Modern Form',
    description: 'A contemporary sculpture made of bronze, exploring geometric shapes and negative space.',
    category: 'Sculptures',
  },
  {
    title: 'Dancing Figure',
    description: 'An expressive sculpture capturing the grace and movement of a dancer in mid-motion.',
    category: 'Sculptures',
  },
  {
    title: 'Abstract Cube',
    description: 'A minimalist steel sculpture featuring clean lines and a reflective surface.',
    category: 'Sculptures',
  },
  {
    title: 'Cyber Landscape',
    description: 'A digital artwork depicting a futuristic cityscape with neon lights and holographic displays.',
    category: 'Digital Art',
  },
  {
    title: 'Fractal Dreams',
    description: 'An intricate digital composition based on mathematical fractals and vibrant color gradients.',
    category: 'Digital Art',
  },
  {
    title: 'Pixel Universe',
    description: 'A retro-inspired digital piece combining pixel art aesthetics with cosmic themes.',
    category: 'Digital Art',
  },
];

// Create placeholder image data
function createPlaceholderImage(name, colorIndex) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9', '#A29BFE', '#FD79A8', '#FDCB6E'];
  const color = colors[colorIndex % colors.length];
  
  // Create a simple SVG placeholder
  const svg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="400" fill="${color}"/>
    <text x="300" y="200" font-size="40" fill="white" text-anchor="middle">${name}</text>
  </svg>`;
  
  return Buffer.from(svg);
}

async function seedData() {
  console.log('Starting to seed data...');
  
  for (let i = 0; i < artPieces.length; i++) {
    const piece = artPieces[i];
    console.log(`\nCreating art piece ${i + 1}/${artPieces.length}: ${piece.title}`);
    
    try {
      // Create a placeholder image
      const imageBuffer = createPlaceholderImage(piece.title, i);
      const tempImagePath = path.join(__dirname, `temp-image-${i}.svg`);
      fs.writeFileSync(tempImagePath, imageBuffer);
      
      // Upload the image first
      const formData = new FormData();
      formData.append('files', fs.createReadStream(tempImagePath), {
        filename: `${piece.title.toLowerCase().replace(/\s+/g, '-')}.svg`,
        contentType: 'image/svg+xml',
      });
      
      console.log('  Uploading image...');
      const uploadResponse = await axios.post(`${API_URL}/upload`, formData, {
        headers: formData.getHeaders(),
      });
      
      const imageId = uploadResponse.data[0].id;
      console.log(`  Image uploaded with ID: ${imageId}`);
      
      // Create the art piece entry
      console.log('  Creating art piece entry...');
      const artPieceData = {
        data: {
          title: piece.title,
          description: piece.description,
          category: piece.category,
          image: imageId,
        },
      };
      
      const createResponse = await axios.post(`${API_URL}/art-pieces`, artPieceData);
      console.log(`  Art piece created with ID: ${createResponse.data.data.id}`);
      
      // Publish the entry
      console.log('  Publishing art piece...');
      await axios.put(`${API_URL}/art-pieces/${createResponse.data.data.id}`, {
        data: {
          publishedAt: new Date().toISOString(),
        },
      });
      
      console.log(`  ✓ Art piece "${piece.title}" completed`);
      
      // Clean up temp image
      fs.unlinkSync(tempImagePath);
    } catch (error) {
      console.error(`  ✗ Failed to create "${piece.title}":`, error.response?.data || error.message);
    }
  }
  
  console.log('\n✓ Seed data complete!');
}

seedData().catch(console.error);
