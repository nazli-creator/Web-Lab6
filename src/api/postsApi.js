const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export async function fetchPosts() {
  const response = await fetch(POSTS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts (status ${response.status})`);
  }

  return response.json();
}
