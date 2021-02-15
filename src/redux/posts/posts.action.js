
import postTypes from './posts.types';


export const incrementLike = (user) => ({
    type: postTypes.INCREMENT_LIKES,
    payload: user
})