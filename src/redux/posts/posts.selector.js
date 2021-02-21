import {createSelector} from 'reselect';

const State = (state) => {
    return state.posts;
}
export const postState = createSelector([State], posts => {
    return posts.loadPosts
})