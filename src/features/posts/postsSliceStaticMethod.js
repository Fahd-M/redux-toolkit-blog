// FYI ONLY - not part of project. 
//PREVIOUS VERSION OF THE postsSlice PAGE (IN MAIN BRANCH)

// <---THIS WAS METHOD WITH INITIAL STATE THAT WAS STATIC STATE, WILL USE DATA FROM API NOW ---->
// const initialState = [
//     { 
//         id: '1', 
//         title:'Learning Redux toolkit',
//         content:"I've heard good things!",
//         date: sub(new Date(), { minutes: 10 }).toISOString(),//new date object then subtract 10 mins, converting to a timestamp string
//         reactions: {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0, 
//             coffee: 0
//         }
//     },
//     { 
//         id: '2', 
//         title:'Slices...',
//         content:"The more I say slice, the more I want pizza.",
//         date: sub(new Date(), { minutes: 5 }).toISOString(),
//         reactions: {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0, 
//             coffee: 0
//         }
//     }
// ]


// const postsSlice = createSlice({
//     name:'posts',
//     initialState,
//     reducers: {
//         postAdded: {  // Post added has a reducer and a preparer.
//             reducer(state, action) { 
//             state.push(action.payload) 
//             // payload is form data that is sent or dispatched when post added
//             },
//         // When we create postAdded fx then createSlice auto generates an action creator fx with same name.
//         // When we export our actions below we actually exporting this action creator fx which was auto-created.
//             prepare(title,content, userId) {
//                 return { // Note: any new post thats created must be 'prepared' and have same options as the initial state
//                     payload: {
//                         id: nanoid(),
//                         title,
//                         content,
//                         date: new Date().toISOString(),
//                         userId,
//                         reactions: {
//                             thumbsUp: 0,
//                             wow: 0,
//                             heart: 0,
//                             rocket: 0, 
//                             coffee: 0
//                         }
//                     }
//                 }
//             }
//         },
//         reactionAdded(state, action) { 
//             const { postId, reaction } = action.payload
//             const existingPost = state.find(post => post.id === postId)
//             if (existingPost) {
//                 existingPost.reactions[reaction]++ 
//                 //technically mutating state but since within createSlice it is handled by EmerJs under hood.
//             }
//         }
//     }
// })

// export const selectAllPosts = (state) => state.posts; 

// export const { postAdded, reactionAdded } = postsSlice.actions;

// export default postsSlice.reducer;