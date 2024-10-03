import { UserPlan } from './user-plan.enum';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      plan: UserPlan;
    }
  }
}