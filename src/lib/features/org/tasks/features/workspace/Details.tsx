"use client";

import { Blockquote, Flex, Paper, SimpleGrid, Text } from "@mantine/core";
import { PriorityListNoSsr, StatusListNoSsr } from "@/lib/ui/NoSsr";
import { FaCircleExclamation } from "react-icons/fa6";
import { useTasksContext } from "../../TasksContext";
import WorkspaceEditForm from "./edit/WorkspaceEditForm";
import CategoryList from "./features/category/List";

export default function WorkspaceDetails({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const tasksCtx = useTasksContext();
  const workspace = tasksCtx.state.workspaces.find(
    (workspace) => workspace.id === workspaceId,
  );

  if (!workspace) {
    return (
      <Flex justify={"center"} align={"center"} mt={"xl"}>
        <Paper shadow="md">
          <Blockquote color="red" icon={<FaCircleExclamation />}>
            <Text>Workspace not found.</Text>
          </Blockquote>
        </Paper>
      </Flex>
    );
  }

  return (
    <Flex direction={"column"} gap={"md"}>
      <WorkspaceEditForm id={workspace.id} />
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <CategoryList workspaceId={workspace.id} />
      </SimpleGrid>
      <PriorityListNoSsr workspaceId={workspace.id} />
      <StatusListNoSsr workspaceId={workspace.id} />
    </Flex>
  );
}
