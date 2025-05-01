import express from "express";
import { UserRoutes } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParticipantRoutes } from "../modules/participant/participant.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/participants",
    route: ParticipantRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
