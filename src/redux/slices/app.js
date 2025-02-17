import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT", // can be CONTACT, STARRED, SHARED
  },
  snackbar: {
    open: null,
    message: null,
    severity: null,
  },
  users: [],
  friends: [],
  friendRequests: [],
  chat_type: null,
  room_id: null,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Toggle Sidebar
    toggleSideBar(state, action) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSideBarType(state, action) {
      state.sidebar.type = action.payload.type;
    },
    openSnackbar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackbar(state, action) {
      state.snackbar.open = false;
      state.snackbar.severity = null;
      state.snackbar.message = null;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.friendRequests;
    },
    selectConversation(state, action) {
      state.chat_type = "individual";
      state.room_id = action.payload.room_id;
    }
  },
});

// Reducer
export default slice.reducer;

export function ToggleSideBar() {
  return async (dispatch) => {
    dispatch(slice.actions.toggleSideBar());
  };
}

export function UpdateSidebarType(type) {
  return async (dispatch) => {
    dispatch(
      slice.actions.updateSideBarType({
        type,
      })
    );
  };
}

export function ShowSnackbar({ severity, message }) {
  return async (dispatch, getState) => {
    dispatch(
        slice.actions.openSnackbar({
            message, severity
        })
    );

    setTimeout(() => {
        dispatch(slice.actions.closeSnackbar());
    }, 4000);
  };
};

export function closeSnackbar() {
    return async (dispatch) => {
        dispatch(slice.actions.closeSnackbar());
    }
};

export function FetchUsers () {
  return async (dispatch, getState) => {
      await axios.get("/user/get-users",          
          {
              headers: {
                  "Content-Type": "application/json", 
                  Authorization: `Bearer ${getState().auth.token}`,
              },
          }        
      ).then((response) => {
         console.log(response);
         dispatch(slice.actions.updateUsers({users: response.data.data}));
      }).catch((error) => {
          console.log(error);
      })
  }
}

export const FetchFriends = () => {
  return async (dispatch, getState) => {
    await axios.get("/user/get-friends", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    }).then((response) => {
      console.log(response);
      dispatch(slice.actions.updateFriends({friends: response.data.data}))
    }).catch((error) => {
      console.log(error);
    })
  }
};

export const FetchFriendRequests = () => {
  return async (dispatch, getState) => {
    await axios.get("/user/get-friend-requests", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    }).then((response) => {
      console.log(response);
      dispatch(slice.actions.updateFriendRequests({friendRequests: response.data.data}))
    }).catch((error) => {
      console.log(error);
    })
  }
};

export const SelectConversation = ({room_id}) => {
  console.log(room_id);
  return (dispatch, getState) => {
    dispatch(slice.actions.selectConversation((room_id)));
  };
};


