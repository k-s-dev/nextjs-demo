"use server";

import { getUserCount } from "@/lib/dataModels/auth/user/dataAccessControl";
import { routes } from "@/lib/utils/routeMapper";

export async function getAdminModelList(flattenModelList = false) {
  const response = await getUserCount({}, "server")

  const adminModels: IAdminModelList = {
    Auth: [
      {
        name: "User",
        titlePlural: "Users",
        rootPath: routes.admin.user.root,
        href: routes.admin.user.read,
        count: response.data as number,
      },
    ],
  };

  const flattenedArray: IAdminModelInfo[] = [];

  Object.entries(adminModels).forEach(([key, item]) => {
    if (Array.isArray(item)) {
      const newObjList = item.map((o) => {
        return {
          category: key,
          ...o,
        };
      });
      flattenedArray.push(...newObjList);
    }
  });

  if (flattenModelList) {
    return flattenedArray;
  } else {
    return adminModels;
  }
}

export interface IAdminModelList {
  [k: string]: IAdminModelInfo[] | IAdminModelList;
}

export interface IAdminModelInfo {
  name: string;
  titlePlural: string;
  rootPath: string;
  href: string;
  count: number;
  category?: string;
}
