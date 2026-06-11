import "express-session";

export type UserSession = {
  id: number;
  name: string;
  email: string;
  role: string;
  branch?: string | null;
  branchId?: number | null;
};

export type BasketItemSession = {
  menuItemId: number;
  quantity: number;
};

declare module "express-session" {
  interface SessionData {
    user?: UserSession;
    selectedBranch?: string;
    selectedBranchId?: number;
    basket?: BasketItemSession[];
  }
}
