import TagList from "@/lib/features/org/tasks/features/workspace/features/tag/List";
import WorkspaceList from "@/lib/features/org/tasks/features/workspace/List";
import AddWorkspaceQuick from "@/lib/features/org/tasks/features/workspace/QuickAdd";
import Layout03 from "@/lib/ui/layout/01/03/Layout03";
import { Divider, Flex } from "@mantine/core";

export default async function Page() {
  return (
    <Layout03>
      <main>
        <Flex direction={"column"} gap={"md"} mb={"xl"}>
          <h1>Workspaces</h1>
          <AddWorkspaceQuick />
          <Divider size={"sm"} />
          <WorkspaceList />
          <Divider size={"sm"} />
          <TagList />
        </Flex>
      </main>
    </Layout03>
  );
}
