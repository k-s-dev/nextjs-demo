import TaskFilters from "@/lib/features/org/tasks/features/task/Filters";
import TaskList from "@/lib/features/org/tasks/features/task/List";
import TaskSort from "@/lib/features/org/tasks/features/task/Sort";
import {
  Layout02,
  Layout02Left,
  Layout02Main,
  Layout02Right,
} from "@/lib/ui/layout/01/02/Layout";

export default async function page() {
  return (
    <>
      <Layout02>
        <Layout02Left>
          <TaskFilters />
        </Layout02Left>
        <Layout02Main>
          <TaskList />
        </Layout02Main>
        <Layout02Right>
          <TaskSort />
        </Layout02Right>
      </Layout02>
    </>
  );
}
