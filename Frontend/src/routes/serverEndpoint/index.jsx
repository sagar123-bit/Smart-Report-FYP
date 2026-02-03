
const BASE_URL="/api"

//auth routes
export const USER_BEFORE_REGISTER=`${BASE_URL}/auth/user-before-register`;
export const REGISTER=`${BASE_URL}/auth/register`;
export const LOGIN=`${BASE_URL}/auth/login`;
export const RESEND_VERIFICATION_CODE=`${BASE_URL}/auth/resend-verification-code`;

export const FORGET_PASSWORD=`${BASE_URL}/auth/forget-password`;
export const RESET_PASSWORD=`${BASE_URL}/auth/reset-password`;

export const GET_AUTH_USER=`${BASE_URL}/auth/get-auth-user`;
export const LOGOUT=`${BASE_URL}/auth/logout`;


//user routes
export const USER_IMAGE=`${BASE_URL}/user/user-image`;
export const UPDATE_USER_PROFILE=`${BASE_URL}/user/update-profile`;

export const CREATE_CRIME_REPORT=`${BASE_URL}/user/crime-report`;

export const GET_ALL_USERS =`${BASE_URL}/user/get-all-users`;
export const GET_ALL_CRIME_REPORTS = `${BASE_URL}/user/get-all-reports`
export const UPDATE_CRIME_REPORT=`${BASE_URL}/user/update-user-report`;
export const DELETE_CRIME_REPORT=`${BASE_URL}/user/delete-report`;
export const UPDATE_USER_STATUS=`${BASE_URL}/user/update-user-status`;
export const VERIFY_POLICE=`${BASE_URL}/user/verify-police`;

export const UPDATE_REPORT_STATUS=`${BASE_URL}/user/update-report-status`;
export const GET_ALL_NOTIFICATIONS=`${BASE_URL}/user/get-all-notifications`;
export const DELETE_SINGLE_NOTIFICATION=`${BASE_URL}/user/delete-single-notification`;
export const DELETE_ALL_NOTIFICATIONS=`${BASE_URL}/user/delete-all-notifications`;
export const MARK_ALL_READ_NOTIFICATIONS=`${BASE_URL}/user/notifications/mark-all-read`;

export const CREATE_CRIME_REPORT_ROOM=`${BASE_URL}/user/create-room`;
export const GET_MY_CRIME_REPORT_ROOMS=`${BASE_URL}/user/get-user-rooms`;
export const DELETE_CRIME_REPORT_ROOM=`${BASE_URL}/user/delete-room`;
export const GET_CRIME_REPORT_ROOM_MESSAGES=`${BASE_URL}/user/get-messages`;
export const UPLOAD_MESSAGE_FILE=`${BASE_URL}/user/upload-message-file`;