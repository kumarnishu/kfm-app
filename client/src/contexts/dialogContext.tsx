import React, { useReducer } from "react"

type UserChoices = "signup" | "send_password_reset_link" | "close_user" | "create_or_edit_user" | "update_profile" | "view_profile" | "update_password" | "reset_password" | "send_email_verification_link" |
  "toogle_block_user" | "toogle_admin" | "change_password_from_admin" | "toogle_multi_device_login" | "assign_users" | "assign_permissions" | "bulk_assign_permissions"

type CustomerChoices = "create_or_edit_customer" | "close_customer"|"toogle_block_customer"

type ChoiceState = UserChoices | CustomerChoices
const initialState: ChoiceState | null = null


export enum CustomerChoiceActions {
  create_or_edit_customer = "create_or_edit_customer",
  close_customer = "close_customer",
  toogle_block_customer ="toogle_block_customer"
}
export enum UserChoiceActions {
  assign_users = "assign_users",
  assign_permissions = "assign_permissions",
  bulk_assign_permissions = "bulk_assign_permissions",
  signup = "signup",
  send_password_reset_link = "send_password_reset_link",
  close_user = "close_user",
  create_or_edit_user = "create_or_edit_user",
  update_profile = "update_profile",
  view_profile = "view_profile",
  reset_password = "reset_password",
  update_password = "update_password",
  send_email_verification_link = "send_email_verification_link",
  toogle_block_user = "toogle_block_user",
  toogle_admin = "toogle_admin",
  change_password_from_admin = "change_password_from_admin",
  toogle_multi_device_login = "toogle_multi_device_login",

}

type Action = {
  type: UserChoiceActions | CustomerChoiceActions
}

// reducer
function reducer(state: ChoiceState | null, action: Action) {
  let type = action.type
  switch (type) {
    // user dialogs choices
    case UserChoiceActions.signup: return type
    case UserChoiceActions.send_password_reset_link: return type
    case UserChoiceActions.create_or_edit_user: return type
    case UserChoiceActions.update_profile: return type
    case UserChoiceActions.view_profile: return type
    case UserChoiceActions.update_password: return type
    case UserChoiceActions.reset_password: return type
    case UserChoiceActions.send_email_verification_link: return type
    case UserChoiceActions.toogle_block_user: return type
    case UserChoiceActions.toogle_admin: return type
    case UserChoiceActions.close_user: return type
    case UserChoiceActions.change_password_from_admin: return type
    case UserChoiceActions.assign_users: return type
    case UserChoiceActions.toogle_multi_device_login: return type
    case UserChoiceActions.bulk_assign_permissions: return type
    case UserChoiceActions.assign_permissions: return type

    case CustomerChoiceActions.create_or_edit_customer: return type
    case CustomerChoiceActions.toogle_block_customer: return type
    case CustomerChoiceActions.close_customer: return type


    default: return state
  }
}
// context
type Context = {
  choice: ChoiceState | null,
  setChoice: React.Dispatch<Action>
}
export const ChoiceContext = React.createContext<Context>(
  {
    choice: null,
    setChoice: () => null
  }
)
// provider
export function ChoiceProvider(props: { children: JSX.Element }) {
  const [choice, setChoice] = useReducer(reducer, initialState)
  return (
    <ChoiceContext.Provider value={{ choice, setChoice }}>
      {props.children}
    </ChoiceContext.Provider>
  )

}