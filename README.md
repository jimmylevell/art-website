# Art Website

A full-stack web application for showcasing art pieces, built with React frontend and Strapi backend.

## Features

- Display art pieces with images, descriptions, and categories
- Organize art pieces by categories
- Show the first few pieces from each category on the main page
- Click on any art piece to view it in a full-screen modal viewer
- Modern, responsive design with Tailwind CSS
- Built with TypeScript for type safety

## Tech Stack

### Backend
- Strapi v5 (Headless CMS)
- SQLite database
- Node.js
- TypeScript

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Axios for API calls

## Prerequisites

- Node.js (v20 or higher)
- npm (v6 or higher)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies (already done if you followed the setup):
```bash
npm install
```

3. Build the admin panel:
```bash
npm run build
```

4. Start the Strapi server:
```bash
npm run develop
```

The Strapi admin panel will be available at `http://localhost:1337/admin`

5. Create an admin account when prompted

6. Add some art pieces:
   - Go to Content Manager > Art Pieces
   - Click "Create new entry"
   - Fill in the fields:
     - Title (optional): Name of the art piece
     - Description: Description of the art piece
     - Category: Category name (e.g., "Paintings", "Sculptures", "Digital Art")
     - Image: Upload an image file
   - Click "Save" and then "Publish"
   - Add a few more art pieces in different categories

7. Configure permissions:
   - Go to Settings > Users & Permissions plugin > Roles > Public
   - Find "Art-piece" and check the "find" and "findOne" permissions
   - Click "Save"

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (already done if you followed the setup):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The React app will be available at `http://localhost:5173`

## Usage

1. Make sure both backend (Strapi) and frontend (React) servers are running
2. Add art pieces through the Strapi admin panel
3. View the art gallery at `http://localhost:5173`
4. The main page will display all categories with the first 3 pieces from each
5. Click on any art piece to open the full-screen viewer with image, title, description, and category

## Project Structure

```
art-website/
├── backend/               # Strapi backend
│   ├── config/           # Configuration files
│   ├── src/
│   │   └── api/
│   │       └── art-piece/  # Art piece content type
│   └── package.json
├── frontend/             # React frontend (TypeScript)
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── ArtPiece.tsx
│   │   │   ├── ArtViewer.tsx
│   │   │   └── CategorySection.tsx
│   │   ├── services/     # API services
│   │   │   └── api.ts
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   └── package.json
└── README.md
```

## Development

### Backend
- Admin panel: `http://localhost:1337/admin`
- API endpoint: `http://localhost:1337/api`
- Available commands:
  - `npm run develop` - Start in development mode
  - `npm run start` - Start in production mode
  - `npm run build` - Build admin panel

### Frontend
- Development server: `http://localhost:5173`
- Available commands:
  - `npm run dev` - Start development server
  - `npm run build` - Build for production
  - `npm run preview` - Preview production build

## API Endpoints

- `GET /api/art-pieces` - Get all art pieces
- `GET /api/art-pieces?populate=*` - Get all art pieces with populated relations (images)
- `GET /api/art-pieces/:id` - Get a specific art piece

## License

MIT