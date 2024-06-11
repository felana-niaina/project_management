import { Router } from "express";
import authRoutes from "./auth";
import formulaire from "./formulaire";
import card from "./card";
import column from "./column";
import project from "./project";
import user from "./user";
import notification from "./notification";
import upload from "./uploadFile";
import invitation from "./invitation";
import roles from "./roles";
import backlog from "./backlog"
const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/formulaire", formulaire);
routes.use("/roles", roles);
routes.use("/column", column);
routes.use("/card", card);
routes.use("/project", project);
routes.use("/user", user);
routes.use("/backlog", backlog);
routes.use("/notification", notification);
routes.use("/upload", upload);
routes.use("/invitation", invitation);

export default routes;
