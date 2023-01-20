import PostsLists from "./features/posts/PostsLists";
import AddPostForm from "./features/posts/AddPostForm";

function App() {
  return (
    <main className="App">
      <AddPostForm />
      <PostsLists />
    </main>
  );
}

export default App;


//Redux Async Logic: 
// Redux does everything sync so anything asynchronous is outside of it in redux middleware.
// Async middleware - THUNK
// Thunk = 'a piece of code that does some delayed work'
