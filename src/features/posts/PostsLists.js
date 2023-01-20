import { useSelector } from "react-redux";
import { selectAllPosts } from "./postsSlice";
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButtons from "./ReactionButtons";

const PostsLists = () => {

    const posts = useSelector(selectAllPosts)
    // selectAllPosts brought from slice so that if anything in state structure changes it is accounted for
    
    const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date))
    //localecompare returns -1,0,1 based on if one is greater than the other, then sort posts by date string
    // slice gives shallow copy of array where we store in orderedPosts

    const renderedPosts = orderedPosts.map(post => (
        <article key={post.id}>
            <h3> {post.title} </h3>
            <p> {post.content.substring(0, 100)} </p>
            
            <p className="postCredit">
              <PostAuthor userId={post.userId}/>
              <TimeAgo timestamp={post.date}/>
            </p>
            <ReactionButtons post={post} />
        </article>
    ))

  return (
    <section>
        <h2> Posts </h2>
        {renderedPosts}
    </section>
  )
}

export default PostsLists