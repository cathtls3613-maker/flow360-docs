/**
 * Identity Engine — public API.
 *
 * Owns companies (tenants), users, roles, and sessions. Other code
 * imports from here only; the engine's internal folders are private.
 */

export type {
  Company,
  CompanyRole,
  CurrentUser,
  SignInInput,
  SignUpInput,
  SignUpResult,
  UserProfile,
} from "./domain/types";

export { signInSchema, signUpSchema } from "./domain/validation";

export {
  getCurrentUser,
  signIn,
  signOut,
  signUpWithWorkspace,
} from "./service/identity-service";
