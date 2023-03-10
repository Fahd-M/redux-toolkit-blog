import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios";
//generally first file to start this Redux workflow.

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

// Optimization(state Normalization) from PostsExcerpt starts here
const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date) //similar to postsList sort 
})

const initialState = postsAdapter.getInitialState({
    status: 'idle' , // 'idle' | 'loading' | 'succeeded' | 'failed' 
    error: null,
    count: 0
})

//createAsyncThunk accepts 2 args: string thats used as prefix for generated action type, payload creator callback that returns a promise that contains some data
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    const { id } = initialPost;
     // try-catch block only for development/testing with fake API
    // otherwise, remove try-catch and add updatePost.rejected case
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch (err) {
        //return err.message;
        return initialPost; //only for testing redux! 
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async(initialPost) => {
    const { id } = initialPost;

    const response = await axios.delete(`${POSTS_URL}/${id}`)
    if (response?.status === 200) return initialPost;
    return `${response?.status}: ${response?.statusText}`;
})

const postsSlice = createSlice({
    name:'posts',
    initialState,
    reducers: {
    //Note: Sometimes reducers must respond to other actions which aren't defined as part of slice's reducers. ex. fetchposts
        
        reactionAdded(state, action) { 
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++ 
                //technically mutating state but since within createSlice it is handled by EmerJs under hood.
            }
        },
        increaseCount(state, action) {
            state.count = state.count + 1 //can mutate state inside createSlice
        }
    },
    extraReducers(builder) { //handles things that aren't defined in normal reducer part of slice.
// builder parameter  accepted: An object that lets us define additional case reducers that run in response to actions defined outside of the slice
        builder 
        //cases listen for promise status action types that are dispatched by fetchposts thunk then set state accordingly.
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });

                // Add any fetched posts to the array
                //Pre-optimization: state.posts = state.posts.concat(loadedPosts)
                //Optimized: postadapter has own crud methods
                postsAdapter.upsertMany(state, loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
               // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs
                // const sortedPosts = state.posts.sort((a, b) => {
                //     if (a.id > b.id) return 1
                //     if (a.id < b.id) return -1
                //     return 0
                // })
                action.payload.id = state.ids[state.ids.length - 1] + 1;
                // End fix for fake API post IDs

                
            // api does not have some of the data we using such as date and reactions
                action.payload.userId = Number(action.payload.userId) // api provides userID as string
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0   
                }
                console.log(action.payload)
                // Pre-optimization: state.posts.push(action.payload)
                //Optimized: 
                postsAdapter.addOne(state, action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) =>{
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return;
                }
                // Pre-optimization:const { id } = action.payload;
                action.payload.date = new Date().toISOString();
                // Pre-optimization: const posts = state.posts.filter(post => post.id !== id);
                // Pre-optimization: state.posts = [...posts, action.payload];
                //Optimized:
                postsAdapter.upsertOne(state, action.payload)
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload; 
                // Pre-optimization: const posts = state.posts.filter(post => post.id !== id);
                // Pre-optimization: state.posts = posts;
                postsAdapter.removeOne(state, id)
            })
            
    }
})

//Optimization: getSelectors create these selectors and we rename them with aliases using destructuring
// go to PostsList after to use this optimization, then postsExercept 
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

// Pre-optimization:export const selectAllPosts = (state) => state.posts.posts; 
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;
//Note: action creator functions are automatically created when you put a reducer in the createSlice 

// Pre-optimization:export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId);

export const selectPostsByUser = createSelector(
    // accepts 1 or more input functions , notice that they are inside [] like array. therefore the values returned are the DEPENDENCIES
    // DEPENDENCIES (provide input parameters ((posts,userId)) for output fx of memoized selector)
    // if selectAllPosts value changes or anonymous fx that returns userID change
    //if posts or userId changes thats the only time we get something new from selector(or it re-runs).
    [selectAllPosts, (state, userId) => userId],
    (posts,userId) => posts.filter(post => post.userId === userId)
)

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;







//  ****** THIS BELOW CODE NO LONGER NEEDED DUE TO ASYNC THUNK BEING USED. WAS PREVIOUSLY INSIDE reducers: {}. //

// postAdded: {  // Post added has a reducer and a preparer.
//     reducer(state, action) { 
//     state.posts.push(action.payload) 
//     // payload is form data that is sent or dispatched when post added
//     },
// // When we create postAdded fx then createSlice auto generates an action creator fx with same name.
// // When we export our actions below we actually exporting this action creator fx which was auto-created.
//     prepare(title,content, userId) {
//         return { // Note: any new post thats created must be 'prepared' and have same options as the initial state
//             payload: {
//                 id: nanoid(),
//                 title,
//                 content,
//                 date: new Date().toISOString(),
//                 userId,
//                 reactions: {
//                     thumbsUp: 0,
//                     wow: 0,
//                     heart: 0,
//                     rocket: 0, 
//                     coffee: 0
//                 }
//             }
//         }
//     }
// },