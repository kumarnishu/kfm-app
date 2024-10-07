import React, { useReducer } from "react"

type UserChoices = "signup" | "reset_password_mail" | "close_user" | "new_user" | "update_user" | "update_profile" | "view_profile" | "update_password" | "reset_password" | "verify_email" | "control_access" | "delete_user" | "toogle_flow_status" |
  "block_user" | "unblock_user" | "make_admin" | "remove_admin"  | "update_user_password" | "block_multi_login" | "reset_multi_login" | "assign_users"  | "assign_permissions" | "bulk_assign_permissions"


type VisitChoices = "start_day" | "end_day" | "visit_in" | "visit_out" | "close_visit" | "view_visit" | "validate_visit" | "add_summary" | "edit_summary" | "add_ankit_input" | "view_comments" | "view_visit_photo" | "mark_attendence" | "upload_samples"

type CompanyChoices = "create_oredit_company" | "toogle_company_status"|"close_company"


type ChoiceState = UserChoices | VisitChoices | CompanyChoices

const initialState: ChoiceState | null = null



export enum VisitChoiceActions {
  upload_samples = "upload_samples",
  view_visit_photo = "view_visit_photo",
  mark_attendence = "mark_attendence",
  start_day = "start_day",
  end_day = "end_day",
  visit_in = "visit_in",
  visit_out = "visit_out",
  close_visit = "close_visit",
  view_visit = "view_visit",
  validate_visit = "validate_visit",
  add_summary = "add_summary",
  edit_summary = "edit_summary",
  add_ankit_input = "add_ankit_input",
  view_comments = "view_comments"

}

export enum CompanyChoiceActions {
  create_oredit_company = "create_oredit_company",
  toogle_company_status = "toogle_company_status",
  close_company ="close_company"
}



export enum UserChoiceActions {
  bulk_assign_erp_states = "bulk_assign_erp_states",
  assign_users = "assign_users",
  assign_permissions="assign_permissions",
  bulk_assign_permissions= "bulk_assign_permissions",
  signup = "signup",
  reset_password_mail = "reset_password_mail",
  close_user = "close_user",
  new_user = "new_user",
  update_user = "update_user",
  update_profile = "update_profile",
  view_profile = "view_profile",
  reset_password = "reset_password",
  update_password = "update_password",
  verify_email = "verify_email",
  block_user = "block_user",
  unblock_user = "unblock_user",
  make_admin = "make_admin",
  remove_admin = "remove_admin",
  delete_user = "delete_user",
  control_access = "control_access",
  update_user_password = "update_user_password",
  block_multi_login = "block_multi_login",
  reset_multi_login = "reset_multi_login",

}

type Action = {
  type: UserChoiceActions | VisitChoiceActions | CompanyChoiceActions
}

// reducer
function reducer(state: ChoiceState | null, action: Action) {
  let type = action.type
  switch (type) {
    // user dialogs choices
    case UserChoiceActions.signup: return type
    case UserChoiceActions.reset_password_mail: return type
    case UserChoiceActions.new_user: return type
    case UserChoiceActions.update_user: return type
    case UserChoiceActions.update_profile: return type
    case UserChoiceActions.view_profile: return type
    case UserChoiceActions.update_password: return type
    case UserChoiceActions.reset_password: return type
    case UserChoiceActions.verify_email: return type
    case UserChoiceActions.block_user: return type
    case UserChoiceActions.unblock_user: return type
    case UserChoiceActions.make_admin: return type
    case UserChoiceActions.control_access: return type
    case UserChoiceActions.remove_admin: return type
    case UserChoiceActions.delete_user: return type
    case UserChoiceActions.close_user: return type
    case UserChoiceActions.update_user_password: return type
    case UserChoiceActions.reset_multi_login: return type
    case UserChoiceActions.assign_users: return type
    case UserChoiceActions.block_multi_login: return type
    case UserChoiceActions.bulk_assign_permissions: return type
    case UserChoiceActions.assign_permissions: return type

   
    // visit
    case VisitChoiceActions.upload_samples: return type
    case VisitChoiceActions.visit_in: return type
    case VisitChoiceActions.visit_out: return type
    case VisitChoiceActions.start_day: return type
    case VisitChoiceActions.end_day: return type
    case VisitChoiceActions.close_visit: return type
    case VisitChoiceActions.view_visit: return type
    case VisitChoiceActions.edit_summary: return type
    case VisitChoiceActions.add_summary: return type
    case VisitChoiceActions.add_ankit_input: return type
    case VisitChoiceActions.view_comments: return type
    case VisitChoiceActions.validate_visit: return type
    case VisitChoiceActions.mark_attendence: return type
    case VisitChoiceActions.view_visit_photo: return type

    case CompanyChoiceActions.create_oredit_company: return type
    case CompanyChoiceActions.close_company: return type
    case CompanyChoiceActions.toogle_company_status: return type

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