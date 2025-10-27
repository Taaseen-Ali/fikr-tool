import fs from "fs";
import path from "path";

export default async function ProphetPage({
  params,
}: {
  params: Promise<{ prophet: string }>;
}) {
  const { prophet } = await params;

  const storiesDir = path.join(process.cwd(), "stories", prophet);

  const storyFiles = fs
    .readdirSync(storiesDir)
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => {
      // Extract numbers from filenames for proper numerical sorting
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });

  const stories = storyFiles.map((file) => {
    const filePath = path.join(storiesDir, file);
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  });

  return (
    <div>
      <h1>{`Prophet: ${prophet}`}</h1>
      <div>
        {stories.map((story, index) => (
          <div key={index}>
            <h2>{story.title}</h2>
            <p>{story.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}