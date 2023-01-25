import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from 'react-router-dom';
// import React from "react";

// Optimization: change let back to const. Change prop from  ({ post }) to  ({ postId })
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";


// Optimization: Method 2: State normalization. Normalized state structure is used for storing items.
// Normalization = Recommended in docs, no duplication of data, creates an ID lookup 
// {  ** THIS IS NORMALIZED STATE SHAPE ** 
//     posts: 
//         { 
//             ids: [1,2,3,...],
//             entities: {
//                 '1':{
//                     userId: 1,
//                     id: 1,
//                     title: ..etc.
//                 }
//             }
//         }
// }
// Redux toolkit offers a createEntityAdapter API - makes slices less complicated and easier to manage.
// HOW? abstracts more logic from components, built in CRUD methods, Automatic selector generation.
// GO TO postsSlice to see it 

//Optimization: Method 1 to prevent all individual posts from re-rendering when a reaction added.
// import react, change const to let PostsExcerpt and set PostsExcerpt to React.memo passing in postsExercept 
// This allows component to not re-render if the prop received has not changed (ex. post)

const PostsExcerpt = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId))
    return (
        <article>
            <h2>{post.title}</h2>
            <p className="excerpt">{post.body.substring(0, 75)}...</p>
            <p className="postCredit">
                <Link to={`post/${post.id}`}>View Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    )
}

//PostsExcerpt = React.memo(PostsExcerpt); 
export default PostsExcerpt