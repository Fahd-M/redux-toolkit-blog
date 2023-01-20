import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";

const reactionEmoji = {
    thumbsUp: '👍',
    wow: '😮',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕'
}
// this is an object lookup hence Object.entries


const ReactionButtons = ({ post }) => {
    const dispatch = useDispatch()

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
            // Map over lookup: key is name, emoji is value.
        return (
            <button
                key={name}
                type="button"
                className="reactionButton"
                onClick={()=>{
                    dispatch(reactionAdded({ postId: post.id, reaction: name }))
                }}
            >
                {emoji} {post.reactions[name]}
            </button>
        )
    })
  return <div>{reactionButtons}</div>
  
}

export default ReactionButtons