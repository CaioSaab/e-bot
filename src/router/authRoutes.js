import { routes } from '.';

export default async function authRoutes(to, from, next) {
  const authToken = window.localStorage.getItem("AUTH_TOKEN");

  const isAuthenticated = Boolean(authToken);
  const { requiresAuthentication } = to.meta;

  if (isAuthenticated) {
    if (requiresAuthentication) {
      next();
    } else {
      next(routes.login);
    }
  } else {
    if (requiresAuthentication) {
      next(routes.login);
    } else {
      next();
    }
  }
}
