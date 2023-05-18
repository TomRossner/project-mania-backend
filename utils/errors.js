// ERROR TYPES

const ERROR_MESSAGES = {
    INVALID_NAME_FORMAT: "Invalid name format. Make sure your names are correctly typed",
    INVALID_EMAIL_FORMAT: "Invalid email address",
    INVALID_PASSWORD_FORMAT: "Password must contain at least 8 characters which will include: 1 lowercase letter (a-z), 1 uppercase letter (A-Z), 1 digit (0-9), and 1 special character (.!#$%&'*+/=?^_`{|}~-)",
    PASSWORDS_DO_NOT_MATCH: "Password do not match. Please try again",
    FORM_FIELD_EMPTY: "All fields must be filled",
    UPDATE_PROJECT_FAILED: "Failed updating project",
    INVALID_TYPE_BOARD: "Invalid values. Could not create board",
    INVALID_TYPE_STAGE: "Invalid values. Could not create stage",
    INVALID_TYPE_TASK: "Invalid values. Could not create task",
    ADMIN_CODES_DO_NOT_MATCH: "Pass codes do not match, please try again",
    ADD_MEMBER_FAILED: "Failed adding member",
    CHOOSE_STAGE_TO_ADD_TASK: "Couldn't create task. Please choose in which stage you would like to add your task to",
    MISSING_EMAIL_OR_PASSWORD: "Please provide an email and a password",

    // Auth errors
    WRONG_PASSWORD: 'Wrong password',
    CHECK_PASSWORD_FAILED: 'Failed checking password',
    UPDATE_PASSWORD_FAILED: 'Failed updating password',
    UPDATE_PROFILE_PICTURE_FAILED: 'Failed updating profile picture',
    UPDATE_USER_FAILED: 'Failed updating user',
    GOOGLE_SIGN_UP_FAILED: 'Failed signing up with Google',
    GOOGLE_SIGN_IN_FAILED: 'Failed signing in with Google',
    USER_ALREADY_REGISTERED: 'User already registered',
    USER_NOT_REGISTERED: 'User not registered',
    GET_USER_FAILED: 'Failed getting user',
    USER_NOT_FOUND: 'User not found',
    LOGIN_FAILED: 'Login failed',
    INCORRECT_EMAIL_OR_PASSWORD: 'Incorrect email or password',
    REGISTRATION_FAILED: 'Registration failed',
    REGISTRATION_FAILED_INVALID_INPUTS: 'Registration failed. Invalid inputs',

    // Chat errors
    FIND_CHAT_FAILED: 'Could not find chat',
    CREATE_CHAT_FAILED: 'Could not create chat',
    DELETE_CHAT_FAILED: 'Could not delete chat',
    GET_USER_CHATS_FAILED: 'Failed getting user chats',
    
    // Members errors
    GET_ALL_USERS_FAILED: 'Failed getting users',
    GET_ALL_USERS_FAILED: 'Failed getting users',

    // Projects errors
    GET_USER_PROJECTS_FAILED: 'Failed getting projects',
    CREATE_BOARD_FAILED: 'Could not create board',
    ADD_NEW_PROJECT_FAILED: 'Failed to add project',
    UPDATE_PROJECT_FAILED: 'Failed updating project',
    TASK_NOT_FOUND: 'Task not found',
    DELETE_TASK_FAILED: 'Failed deleting task',
    DELETE_PROJECT_FAILED: 'Failed deleting project',

    // DB errors
    CONNECT_TO_DB_FAILED: "Failed connecting to database",
}

// Export
module.exports = ERROR_MESSAGES;