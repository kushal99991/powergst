import React, { createContext, useReducer, useEffect, useState } from "react";



const initialState = {
    isModelOpen: false,
    items: []
}

export const ModelStateContext = createContext();
export const ModelDispatchContext = createContext();

const reducer = (state, action) => {
    console.log('State modal  ');
    console.log(state);
    switch (action.type) {
        case "TOGGLE_OTP_POPUP":
            return {
                ...state,
                isModelOpen: !state.isModelOpen
            };
        default:
            throw new Error(`unknow action : ${action.type}`);
    }
}

export const toggleOTPPopup = (dispatch) => {
    console.log(dispatch)
    return dispatch({
        type: "TOGGLE_OTP_POPUP"
    })
}


const ModelProvider = ({ children }) => {
    console.log('call provider')
    const persistedCartState = {
        isModelOpen: false
    };

    const [state, dispatch] = useReducer(reducer, persistedCartState);

    console.log(state)

    return (
        <ModelDispatchContext.Provider value={dispatch}>
            <ModelStateContext.Provider value={state}>
                {children}
            </ModelStateContext.Provider>
        </ModelDispatchContext.Provider>
    );
};

export default ModelProvider;

