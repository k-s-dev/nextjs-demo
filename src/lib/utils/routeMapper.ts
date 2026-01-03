export const routes = {
  generic: {
    home: "/",
    test: "/test",
  },

  api: {
    test: {
      resetDB: "/api/test/db/reset",
    },
  },

  /**
   * Auth routes: used for authentication
   * These routes will be redirect authenticated users to DEFAULT_LOGIN_REDIRECT
   * or DEFAULT_LOGOUT_REDIRECT
   */
  authentication: {
    signUp: "/signUp",
    signIn: "/signIn",
    verifyEmail: "/verify-email",
    resetPassword: "/reset-password",
    authError: "/error",
  },

  admin: {
    root: "/admin",
    user: {
      root: "/admin/user",
      create: "/admin/user/create",
      read: "/admin/user/list",
      withId(id: string, suffix: TRouteSuffix) {
        return `/admin/user/${id}/${suffix}`;
      },
    },
    account: {
      read: "/admin/account/list",
      withId(id: string, suffix: TRouteSuffix) {
        return `/admin/user/${id}/${suffix}`;
      },
    },
  },

  org: {
    root: "/org",
    tasks: {
      root: "/org/tasks",
      settings: {
        root: "/org/tasks/settings"
      },
      workspace: {
        withId(id: string, suffix?: TRouteSuffix) {
          return `/org/tasks/workspace/${id}${suffix ? "/" + suffix : ""}`;
        },
      },
    },
    timer: {
      root: "/org/timer",
    },
    counter: {
      root: "/org/counter",
    },
  },

  // TODO: remove if not needed
  get all() {
    return {
      ...this.generic,
      ...this.authentication,
      ...this.admin,
    };
  },

  /**
   * Public routes: do not need authentication.
   */
  get public() {
    return [
      this.generic.home,
      this.authentication.resetPassword,
      this.authentication.verifyEmail,
    ];
  },

  /**
   * Auth API routes prefix: prefix of routes needed for auth providers like google, github, ...
   */
  authAPIPrefix: "/api/auth",

  DEFAULT_LOGIN_REDIRECT: "/",
};

export type TRouteSuffix = "detail" | "update" | "delete" | string;
