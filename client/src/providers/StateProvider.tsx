import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { AppState, Action } from "./Reducer";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { actionTypes } from "./Reducer";
import { cacheUtils } from "../lib/localStorageCache";

// Define types for better type safety
interface StateProviderProps {
  reducer: (state: AppState, action: Action) => AppState;
  initialState: AppState;
  children: ReactNode;
}

// Add loading state to the context
export interface AppStateWithLoading extends AppState {
  isLoading: boolean;
}

// Create context with proper typing
export const StateContext = createContext<[AppStateWithLoading, React.Dispatch<Action>] | null>(null);

export const StateProvider = ({
  reducer,
  initialState,
  children,
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Add loading state
  const stateWithLoading: AppStateWithLoading = {
    ...state,
    isLoading,
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Firebase auth state changed:", firebaseUser ? "User signed in" : "User signed out");
      
      if (firebaseUser) {
        // User is signed in, restore user data
        const user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        };
        
        console.log("Dispatching SET_USER action:", user);
        dispatch({ 
          type: actionTypes.SET_USER, 
          user, 
          authType: "google" // You might want to determine this based on provider
        });
      } else {
        // User is signed out - clear cache
        console.log("Dispatching LOGOUT action");
        cacheUtils.clearAllCache();
        dispatch({ type: actionTypes.LOGOUT });
      }
      
      // Set loading to false after first auth state check
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);
  
  return React.createElement(
    StateContext.Provider,
    { value: [stateWithLoading, dispatch] },
    children
  );
};

export const useStateValue = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateValue must be used within a StateProvider');
  }
  return context;
};
