import fs from 'fs';
import path from 'path';

const storiesDir = path.join(process.cwd(), 'stories');

export default async function Home() {
  const storyFiles = fs
    .readdirSync(storiesDir)
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => {
      // Extract numbers from filenames for proper numerical sorting
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });

  // ...existing code...
}