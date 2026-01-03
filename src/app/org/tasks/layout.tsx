import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import { getTagsByCreatedById } from "@/lib/dataModels/org/tag/dataAccessLayer";
import { getTasksByCreatedById } from "@/lib/dataModels/org/task/dataAccessLayer";
import { getWorkspacesByCreatedById } from "@/lib/dataModels/org/workspace/dataAccessLayer";
import { auth } from "@/lib/features/authentication/auth";
import {
  ITasksState,
  TasksProvider,
} from "@/lib/features/org/tasks/TasksContext";
import { SessionProvider } from "@/lib/ui/providers/SessionProvider";
import { routes } from "@/lib/utils/routeMapper";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return redirect(routes.authentication.signIn);
  }

  const workspaceDalResponse = await getWorkspacesByCreatedById();
  const tagDalResponse = await getTagsByCreatedById();
  const tasksDalResponse = await getTasksByCreatedById();

  const workspaces = workspaceDalResponse.data || [];

  const tasksStateData: ITasksState = {
    user: session.user as TUserPublic,
    workspaces: workspaces || [],
    tags: tagDalResponse.data || [],
    tasks: tasksDalResponse.data || [],
    filters: {
      workspaces: workspaces.map((el) => el.id),
      categories: [],
      priorities: [],
      statuses: [],
      tags: [],
      visibility: "active",
    },
    sort: [],
  };

  return (
    <>
      <SessionProvider sessionData={session}>
        <TasksProvider stateData={tasksStateData}>{children}</TasksProvider>
      </SessionProvider>
    </>
  );
}
