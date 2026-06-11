import "express-session";

export type UserSession = {
  id: number;
  name: string;
  email: string;
  role: string;
  branch?: string | null;
  branchId?: number | null;
};

declare module "express-session" {
  interface SessionData {
    user?: UserSession;
  }
}
