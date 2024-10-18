import { apiClient } from "./utils/AxiosInterceptor";

export const Login = async (
  body: {
    username: string,
    password: string,
    multi_login_token?: string
  }
) => {
  return await apiClient.post("login", body);
};

export const Signup = async (body: FormData) => {
  return await apiClient.post("signup", body);
};

export const CreateOrEditUser = async ({ id, body }: { id?: string, body: FormData }) => {
  if (id)
    return await apiClient.put(`users/${id}`, body);
  return await apiClient.post("users", body);
};

export const Logout = async () => {
  return await apiClient.post("logout");
};


export const GetAssignedUsersForEdit = async (id: string) => {
  return await apiClient.get(`assigned/users/edit/${id}`)
}

export const GetAllUsers = async ({ hidden, permission, show_assigned_only }: { hidden: boolean, show_assigned_only?: boolean, permission?: string }) => {
  return await apiClient.get(`users/?permission=${permission}&hidden=${hidden}&show_assigned_only=${show_assigned_only}`)
}
export const GetAllUsersForDropDown = async ({ hidden, permission, show_assigned_only }: { hidden: boolean, show_assigned_only?: boolean, permission?: string }) => {
  return await apiClient.get(`dropdown/users/?permission=${permission}&hidden=${hidden}&show_assigned_only=${show_assigned_only}`)
}

export const GetUserForEdit = async (id: string) => {
  return await apiClient.get(`users/edit/${id}`)
}

export const GetPermissions = async () => {
  return await apiClient.get(`permissions`)
}

// make admin
export const ToogleAdmin = async (id: string) => {
  return await apiClient.patch(`toogle-admin/${id}`)
}
// block user
export const ToogleBlockUser = async (id: string) => {
  return await apiClient.patch(`toogle-block-user/${id}`)
}

export const ToogleMultiDeviceLogin = async (id: string) => {
  return await apiClient.patch(`toogle-multi-device-login/${id}`)
}



export const GetProfile = async () => {
  return await apiClient.get("profile");
};
export const UpdateProfile = async (body: FormData) => {
  return await apiClient.put("profile", body);
};

export const UpdatePassword = async (body: { oldPassword: string, newPassword: string, confirmPassword: string }) => {
  return await apiClient.patch("password/update", body)
};
export const ChangePasswordFromAdmin = async ({ id, body }: { id: string, body: { newPassword: string, confirmPassword: string } }) => {
  return await apiClient.patch(`password/change-from-admin/${id}`, body)
};
// //update password
export const ResetPassword = async ({ token, body }:
  {
    token: string,
    body: { newPassword: string, confirmPassword: string }
  }) => {
  return await apiClient.patch(`password/reset/${token}`, body)
};

export const SendMailForResetPasswordLink = async ({ email }:
  {
    email: string
  }) => {
  return await apiClient.post(`send/email/password-reset-link`, { email: email })
};

// verify email
export const VerifyEmail = async (token: string) => {
  return await apiClient.patch(`email/verify/${token}`)
};

// send verification main
export const SendEmailVerificationLink = async ({ email }:
  {
    email: string
  }) => {
  return await apiClient.post(`send/email/verifcation-link`, { email: email })
};

export const AssignUsersUnderManager = async ({ id, body }: { id: string, body: { ids: string[] } }) => {
  return await apiClient.patch(`assign-users/${id}`, body)
}

export const AssignPermissionsToOneUser = async ({ body }: {
  body: {
    user_id: string,
    permissions: string[]
  }
}) => {
  return await apiClient.post(`permissions/one`, body)
}

export const AssignSimilarPermissionToMultipleUsers = async ({ body }: {
  body: {
    user_ids: string[],
    permissions: string[]
  }
}) => {
  return await apiClient.post(`permissions`, body)
}


export const CreateUserFromExcel = async (body: FormData) => {
  return await apiClient.post("create-from-excel/users", body);
};

export const DownloadExcelTemplateForCreateUsers = async () => {
  return await apiClient.get("download/template/users");
};