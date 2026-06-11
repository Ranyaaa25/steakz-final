import type { UserSession } from "../types/session.js";

export const HEAD_OFFICE_ROLE = "head_office";

export function canSeeAllBranches(user: UserSession) {
  return user.role === HEAD_OFFICE_ROLE;
}

export function branchFilter(user: UserSession) {
  return canSeeAllBranches(user) ? {} : { branchId: user.branchId || -1 };
}

export function isBranchRole(user: UserSession) {
  return ["manager", "chef", "waiter"].includes(user.role);
}

export function canManageUsers(user: UserSession) {
  return canSeeAllBranches(user) || user.role === "manager";
}

export function roleLabel(role: string) {
  return role.replace(/_/g, " ").toUpperCase();
}
