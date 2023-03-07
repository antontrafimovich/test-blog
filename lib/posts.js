import { readdir, readFile } from "node:fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export const getPostData = async (fileName) => {
  // Remove ".md" from file name to get id
  const id = fileName.replace(/\.md$/, "");

  // Read markdown file as string
  const fullPath = path.join(postsDirectory, fileName);

  let fileContents;

  try {
    fileContents = await readFile(fullPath, "utf8");
  } catch (err) {
    console.log(err);
    throw err;
  }

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  const data = await remark().use(html).process(matterResult.content);

  const dataHTML = data.toString();

  // Combine the data with the id
  return {
    id,
    dataHTML,
    ...matterResult.data,
  };
};

export async function getSortedPostsData() {
  // Get file names under /posts
  let fileNames;

  try {
    fileNames = await readdir(postsDirectory);
  } catch (err) {
    console.error(err);

    throw err;
  }

  const allPostsData = await Promise.all(fileNames.map(getPostData));

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export const getAllPostIds = async () => {
  let fileNames;

  try {
    fileNames = await readdir(postsDirectory);
  } catch (err) {
    console.error(err);

    throw err;
  }

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
};
