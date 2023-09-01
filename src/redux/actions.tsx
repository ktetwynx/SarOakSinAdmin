import { BEARER_TOKEN, PROFILE } from "./reducer";

const initialState = {
  token: null,
  app_language: "en",
  app_theme: "light",
};

export function App(state = initialState, action: any) {
  switch (action.type) {
    case BEARER_TOKEN:
      return Object.assign({}, state, { token: action.token });
    case PROFILE:
      return Object.assign({}, state, { profile: action.profile });
    default:
      return state;
  }
}
