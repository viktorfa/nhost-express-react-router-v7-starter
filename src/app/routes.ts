import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    layout("routes/auth/layout.tsx", [
      route("auth/sign-in", "routes/auth/sign-in.tsx"),
      route("auth/sign-up", "routes/auth/sign-up.tsx"),
    ]),
    layout("routes/dashboard/layout.tsx", [route("dashboard", "routes/dashboard/dashboard.tsx")]),
    index("routes/home.tsx"),
  ]),
] satisfies RouteConfig;
