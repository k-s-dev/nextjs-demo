import { Flex, Text } from "@mantine/core";
import SidebarNavLinks from "@/lib/features/org/tasks/features/workspace/SidebarNavLinks";
import WorkspaceDetails from "@/lib/features/org/tasks/features/workspace/Details";
import {
  Layout01,
  Layout01Left,
  Layout01Main,
} from "@/lib/ui/layout/01/01/Layout";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <Text c={"orange"}>Workspace id not provided.</Text>;
  }

  return (
    <>
      <Layout01>
        <Layout01Left>
          <aside>
            <Flex direction={"column"}>
              <SidebarNavLinks />
            </Flex>
          </aside>
        </Layout01Left>
        <Layout01Main>
          <main>
            <WorkspaceDetails workspaceId={id} />
          </main>
        </Layout01Main>
      </Layout01>
    </>
  );
}
