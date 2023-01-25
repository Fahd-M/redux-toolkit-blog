import PostsList from "./features/posts/PostsLists";
import AddPostForm from "./features/posts/AddPostForm";
import SinglePostPage from "./features/posts/SinglePostPage";
import EditPostForm from "./features/posts/EditPostForm";
import Layout from "./components/Layout";
import { Routes, Route, Navigate } from 'react-router-dom';
import UserPage from "./features/users/UserPage";
import UsersList from "./features/users/UsersList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<PostsList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>

    {/* Catch all, can also lead to 404 page */}
        <Route path="*" element={<Navigate to="/" replace />} />
        {/* Note: replace flag - replaces bad request address in history with good address we sent user to */}

      </Route>
    </Routes>
  );
}

export default App;


//Redux Async Logic: 
// Redux does everything sync so anything asynchronous is outside of it in redux middleware.
// Async middleware - THUNK
// Thunk = 'a piece of code that does some delayed work'
