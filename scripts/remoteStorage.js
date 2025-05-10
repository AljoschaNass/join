/**
 * The base URL for the Firebase Realtime Database.
 * @constant {string}
 */
const BASE_URL = "https://join-5ba6f-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * The email of the currently logged-in user.
 * @type {string|undefined}
 */
let currentUserEmail; 


/**
 * The name of the currently logged-in user.
 * @type {string|undefined}
 */
let currentUserName; 


/**
 * The contact information of the contact currently being edited.
 * @type {Object|undefined}
 */
let contactToEdit;