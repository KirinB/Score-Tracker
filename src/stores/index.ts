import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "@/stores/slices/game.slice";
import themeReducer from "@/stores/slices/theme.slice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    theme: themeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
