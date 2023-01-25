import { useSelector } from "react-redux"
import { selectUserById } from "./usersSlice"
import { selectAllPosts, selectPostsByUser} from "../posts/postsSlice"
import { Link, useParams } from "react-router-dom"


const UserPage = () => {
    const { userId } = useParams()
    const user = useSelector(state => selectUserById(state, Number(userId)))

    //More optimized version: 
    const postsForUser = useSelector(state => selectPostsByUser(state, Number(userId)))

   // const postsForUser = useSelector(state => {
   //     const allPosts = selectAllPosts(state)
   //     return allPosts.filter(post => post.userId === Number(userId))
    // Optimization: Creating MEMOIZED SELECTOR (go to postsSlice)
    // Why?:  Filter creates a new array each time. UseSelector runs each time an action is dispatched(ex. increaseCount in header).
    // Then useSelector runs again and forces component to rerender if new reference value is returned(We return new value each time wth filter)
   // })

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/post/${post.id}`}> {post.title} </Link>
        </li>
    ))

  return (
    <section>
        <h2> {user?.name} </h2>
        <ol> {postTitles} </ol>
    </section>
  )
}

export default UserPage