export default {
  // System errors
  ERROR_OCCURED: {code: '000', message:'An error occured'},
  CANNOT_CREATE_SESSION: {code: '001', message:'cannot create session'},
  ERROR_REGISTRATION: {code: '002', message:'cannot register user'},
  ERROR_CREATE_ROLE_PERMISSION: {code: '003', message:'cannot create role permission'},
  ERROR_DELETE_ROLE_PERMISSION: {code: '004', message:'an error occured deleting the permission'},

  //validation errors
  INVALID_CREDENTIALS: {code: '101', message:'invalid credentials'},
  USER_BLOCKED: {code: '102', message:'user is blocked'},
  ROLE_STILL_IN_USE: {code: '103', message:'users are still linked to this role'},
  ROLE_PERMISSION_ALREADY_EXISTS: {code: '104', message:'this role permission already exists'},
  ROLE_PERMISSION_MIGRATING_DOESNT_EXISTS: {code: '105', message:'the role permission targeted for migration does not exist'},
  ROLE_DOESNT_EXISTS: {code: '106', message:'the role targeted does not exist'},
  ROLE_PERMISSION_CONNECTION_ALREADY_EXISTS: {code: '107', message:'this role permission connection already exists'},
  ROLE_PERMISSION_DOESNT_EXISTS: {code: '108', message:'this role permission does not exist'},

}