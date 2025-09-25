// Define types for better type safety
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export type AuthType = "google" | "email" | null;
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  authType: AuthType;
}

export interface Action {
  type: string;
  user?: User;
  authType?: AuthType;
}

export const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  authType: null as AuthType,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
} as const;

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user || null,
        isAuthenticated: true,
        authType: action.authType || (null as AuthType),
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        authType: null as AuthType,
      };
    default:
      return state;
  }
};

export default reducer;
