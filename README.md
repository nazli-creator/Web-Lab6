# Assignment 6 - Post Dashboard

A small React application built with Vite. It loads posts asynchronously from the JSONPlaceholder API, shows loading, error and empty states, and lets the user filter posts by title with a controlled input. Async state is managed with `useReducer`.

## File Organization

```
/assignment6
 ├─ src/
 │   ├─ api/
 │   │   └─ postsApi.js        # fetchPosts: data fetching only, no JSX, no React imports
 │   ├─ components/
 │   │   ├─ Post.jsx           # Presentational component, renders one post (title, body)
 │   │   ├─ PostList.jsx       # Renders one Post per item with .map() and a stable key
 │   │   └─ FilterForm.jsx     # Controlled input for filtering posts by title
 │   ├─ reducer/
 │   │   └─ postsReducer.js    # Pure reducer: FETCH_START, FETCH_SUCCESS, FETCH_ERROR
 │   ├─ App.jsx                # Owns async state, runs the fetch effect, derives filtered posts
 │   └─ main.jsx               # Entry point, renders App into the root element
 ├─ index.html
 ├─ vite.config.js
 └─ package.json
```

## Component Responsibilities

```
App                      (state: posts / loading / error via useReducer, filter via useState)
 ├─ h1
 ├─ FilterForm           (props: value, onChange)
 ├─ p                    (Loading posts... / error message / No posts found.)
 └─ PostList             (only rendered when there are posts to show)
     └─ Post             (props: title, body)
```

- **App** owns the async state with `useReducer` and the filter value with `useState`. A single `useEffect` with an empty dependency array fetches the posts on mount and dispatches `FETCH_START`, `FETCH_SUCCESS` or `FETCH_ERROR`. The effect has a cleanup function so no state is updated after unmount.
- **postsReducer** is a pure function. It never mutates the state, always returns a new object and contains no async logic or side effects.
- **postsApi** only contains the `fetch` call. It throws an error when the response is not ok, and `App` catches it with `try/catch`.
- **Filtering is derived state.** Only the source data (`posts`) is stored. The filtered list is computed during render, with no effect and no extra state.
- **PostList** and **Post** are pure render components with no state, effects or fetching logic.
- **FilterForm** is a controlled input. Its value lives in `App` and it only receives `value` and `onChange`.

## Challenges Faced

- **Keeping the reducer pure.** The fetch itself had to stay out of the reducer, so `App` does the async work in `useEffect` and only dispatches plain actions.
- **Avoiding memory leaks.** If the component unmounts before the response arrives, updating state would be a bug. A `cancelled` flag in the effect cleanup prevents this. This also matters because `StrictMode` runs effects twice in development.
- **Derived state instead of stored state.** It is tempting to keep the filtered posts in state and update them in an effect. Computing them during render avoids stale data and extra re-renders.
- **Handling all three states.** Loading, error and empty must each be shown explicitly. `fetch` does not reject on HTTP errors like 404 or 500, so `postsApi` checks `response.ok` and throws.
- **Empty state flash.** With `loading: false` initially, "No posts found." would flash before the effect starts. `App` starts the reducer with `loading: true` to avoid this.

## Running the Project

```
npm install
npm run dev
```
