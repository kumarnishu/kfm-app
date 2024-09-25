import React, { useReducer } from "react"

type UserMenu = "profile_menu" | "close_user_menu" | "user_menu"
type VisitMenu = | "close_visit_menu" | "visit_menu"


type MenuState = {
    type: UserMenu | null | VisitMenu 
    anchorEl: HTMLElement | null
}

const initialState: MenuState = {
    type: null,
    anchorEl: null
}


export enum VisitMenuActions {
    close_visit_menu = "close_visit_menu",
    visit_menu = "visit_menu"
}


export enum UserMenuActions {
    profile_menu = "profile_menu",
    close_user_menu = "close_user_menu",
    user_menu = "user_menu"
}

type Action = {
    type: UserMenuActions | VisitMenuActions 
    anchorEl: HTMLElement | null
}

// reducer
function reducer(state: MenuState | null, action: Action) {
    let type = action.type
    switch (type) {
        // user dialogs menus
        case UserMenuActions.profile_menu: return action
        case UserMenuActions.close_user_menu: return action
        case UserMenuActions.user_menu: return action

        // visit
        case VisitMenuActions.close_visit_menu: return action
        case VisitMenuActions.visit_menu: return action

        default: return state
    }
}
// context
type Context = {
    menu: MenuState | null,
    setMenu: React.Dispatch<Action>
}
export const MenuContext = React.createContext<Context>(
    {
        menu: { type: null, anchorEl: null },
        setMenu: () => null
    }
)
// provider
export function MenuProvider(props: { children: JSX.Element }) {
    const [menu, setMenu] = useReducer(reducer, initialState)
    return (
        <MenuContext.Provider value={{ menu, setMenu }}>
            {props.children}
        </MenuContext.Provider>
    )

}
