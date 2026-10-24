import { useEffect, useReducer, useState } from "react";
import { fetchPosts } from "./api/postsApi";
import { initialState, postsReducer } from "./reducer/postsReducer";
import FilterForm from "./components/FilterForm";
import PostList from "./components/PostList";

function App() {
  const [state, dispatch] = useReducer(postsReducer, {
    ...initialState,
    loading: true,
  });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      dispatch({ type: "FETCH_START" });
      try {
        const data = await fetchPosts();
        if (!cancelled) {
          dispatch({ type: "FETCH_SUCCESS", payload: data });
        }
      } catch (err) {
        if (!cancelled) {
          dispatch({ type: "FETCH_ERROR", payload: err.message });
        }
      }
    }

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  const { posts, loading, error } = state;

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>Post Dashboard</h1>
      <FilterForm value={filter} onChange={setFilter} />

      {loading && <p>Loading posts...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && filteredPosts.length === 0 && (
        <p>No posts found.</p>
      )}
      {!loading && !error && filteredPosts.length > 0 && (
        <PostList posts={filteredPosts} />
      )}
    </div>
  );
}

export default App;
