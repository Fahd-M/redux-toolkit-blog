import { useSelector } from "react-redux";
import { selectPostIds, getPostsStatus, getPostsError } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostsLists = () => {

    // Pre-optimization:const posts = useSelector(selectAllPosts);
    //Optimization:
    const orderedPostIds = useSelector(selectPostIds)

    // selectAllPosts brought from slice so that if anything in state structure changes it is accounted for
    const postsStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);


    let content;
    if (postsStatus === 'loading') {
      content = <p>"Loading..."</p>;
    } else if (postsStatus === 'succeeded') {
      // Pre-optimization: We did sort compare fx in the createEntityAdapter of postsSlice so we must set content differently
      //const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date))
      //content = orderedPosts.map(post => <PostsExcerpt key={post.id} post={post} />)

      //Optimized:
      content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />)
    } else if (postsStatus === 'failed') {
      content = <p> {error} </p>;
    }

  return (
    <section>
        {content}
    </section>
  )
}

export default PostsLists