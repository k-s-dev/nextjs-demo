import EditCategoryRow from "./EditRow";
import { TWorkspaceIncludeAll } from "@/lib/dataModels/org/workspace/definitions";
import { Box, Checkbox, Divider, Flex } from "@mantine/core";
import { Category } from "@/generated/prisma/client";
import { Updater, useImmer } from "use-immer";
import CreateCategory from "./Create";
import { useEffect, useState } from "react";
import DeleteModalButton from "@/lib/ui/form/DeleteModal";
import { deleteCategoriesByIds } from "@/lib/dataModels/org/category/dataAccessLayer";
import { notifications } from "@mantine/notifications";
import {
  addItem,
  getAllChildren,
  getAllParents,
  getChildren,
  getRoot,
} from "@/lib/utils/tree";

export default function CategoryTree({
  workspace,
}: {
  workspace: TWorkspaceIncludeAll;
}) {
  /**
   * NOTE: automated search mixed with add input is not effecient
     kept for sample + categories will be limited so performance will not be 
     impacted significantly
   */
  const [state, setState] = useImmer({} as TreeState);
  const [search, setSearch] = useState("");

  useEffect(() => {
    workspace.categories.forEach((category) => {
      if (!state[category.id]) {
        setState((draft) => {
          draft[category.id] = {
            showChildren: false,
            showAddChild: false,
            isSelected: false,
          };
        });
      }
    });
  }, [state, setState, workspace.categories]);

  if (!workspace.categories || workspace.categories.length <= 0) {
    return (
      <CreateCategory
        value={search}
        setValue={setSearch}
        workspaceId={workspace.id}
      />
    );
  }

  const filteredCategories = [] as Category[];

  const categories =
    search === ""
      ? workspace.categories
      : workspace.categories.filter((category) => {
          const result = search.split(",").some((pattern) => {
            return category.name
              .toLowerCase()
              .includes(pattern.trim().toLowerCase());
          });
          return result;
        });

  categories.forEach((category) => {
    addItem(filteredCategories, category);
    const parents = getAllParents(workspace.categories, category);
    parents.forEach((parent) => addItem(filteredCategories, parent));
  });

  const rootCategories = [] as Category[];
  filteredCategories.forEach((category) => {
    const rootId = getRoot(workspace.categories, category);
    if (!rootCategories.find((item) => item.id === rootId)) {
      const root = workspace.categories.find((item) => item.id === rootId);
      if (root) rootCategories.push(root);
    }
  });

  const ids = Object.keys(state)
  const someSelected = ids.length > 0 && ids.some((k) => state[k].isSelected);
  const allSelected = ids.length > 0 && ids.every((k) => state[k].isSelected);

  function toggleAllSelection() {
    workspace.categories.forEach((category) => {
      setState((draft) => {
        draft[category.id].isSelected = allSelected ? false : true
      });
    });
  }

  async function deleteAllSelected() {
    const ids = Object.entries(state)
      .map(([k, v]) => (v.isSelected ? k : null))
      .filter((el) => el !== null);

    const response = await deleteCategoriesByIds(ids);

    if (response.status === "success") {
      notifications.show({
        message: "Deleted selected ids successfully.",
      });
    }
    if (response.status === "error") {
      notifications.show({ message: response.errors, color: "red" });
    }
    ids.forEach((id) => {
      setState((draft) => {
        delete draft[id];
      });
    });
    return response;
  }

  return (
    <>
      <CreateCategory
        value={search}
        setValue={setSearch}
        workspaceId={workspace.id}
      />
      <Flex gap={"xs"} align={"center"} ps={"xs"}>
        <Checkbox
          checked={allSelected}
          indeterminate={!allSelected && someSelected}
          onChange={toggleAllSelection}
        />
        <DeleteModalButton
          deleteAction={deleteAllSelected}
          title="Delete all selected."
          triggerContent="Delete selected"
          disabled={!someSelected}
          color="red"
          variant="light"
        />
      </Flex>
      {rootCategories.map((category) => {
        return (
          <RenderNode
            key={category.id}
            categories={filteredCategories}
            category={category}
            state={state}
            setState={setState}
          />
        );
      })}
    </>
  );
}

function RenderNode({
  categories,
  category,
  state,
  setState,
  depth = 0,
  offset = 10,
}: {
  categories: Category[];
  category: Category;
  state: TreeState;
  setState: Updater<TreeState>;
  depth?: number;
  offset?: number;
}) {
  const [value, setValue] = useState("");

  function toggleChildren(id: string) {
    setState((draft) => {
      draft[id].showChildren = !draft[id].showChildren;
    });
  }

  function toggleAllChildren(category: Category) {
    setState((draft) => {
      if (draft[category.id]) {
        const currentState = draft[category.id].showChildren;
        draft[category.id].showChildren = !currentState;
        const allChildren = getAllChildren(categories, category);
        allChildren.forEach((child) => {
          draft[child.id].showChildren = !currentState;
        });
      }
    });
  }

  function toggleAddChild(id: string) {
    setState((draft) => {
      draft[id].showAddChild = !draft[id].showAddChild;
    });
  }

  function toggleSelection(category: Category, categories: Category[]) {
    setState((draft) => {
      draft[category.id].isSelected = !draft[category.id].isSelected;
    });
    const children = getAllChildren(categories, category);
    children.forEach((child) => {
      setState((draft) => {
        draft[child.id].isSelected = !draft[child.id].isSelected;
      });
    });
  }

  const children = getChildren(categories, category);
  const isLeaf = children.length <= 0;

  return (
    <Flex
      direction={"column"}
      ps={{ base: 0.75 * offset * depth, sm: offset * depth }}
      gap={"xs"}
      w={"100%"}
    >
      <EditCategoryRow
        category={category}
        open={state[category.id] ? state[category.id].showChildren : false}
        selected={state[category.id] ? state[category.id].isSelected : false}
        isLeaf={isLeaf}
        toggleSelectionAction={() => toggleSelection(category, categories)}
        toggleOpenAction={() => toggleChildren(category.id)}
        toggleOpenAllAction={() => toggleAllChildren(category)}
        toggleAddChildAction={() => toggleAddChild(category.id)}
      />

      {state[category.id] && state[category.id].showAddChild && (
        <Flex>
          <Divider orientation="vertical" size={"xs"} />
          <Box
            ps={{
              base: 0.5 * offset * (depth + 1),
              sm: offset * (depth + 1),
            }}
          >
            <CreateCategory
              value={value}
              setValue={setValue}
              workspaceId={category.workspaceId}
              parentId={category.id}
              postAddAction={() =>
                setState((draft) => {
                  draft[category.id].showAddChild = false;
                })
              }
            />
          </Box>
        </Flex>
      )}

      {children.length > 0 &&
        state[category.id] &&
        state[category.id].showChildren &&
        children.map((child) => {
          return (
            <Flex key={child.id}>
              <Divider orientation="vertical" size={"xs"} />
              <RenderNode
                categories={categories}
                category={child}
                state={state}
                setState={setState}
                depth={depth + 1}
              />
            </Flex>
          );
        })}
    </Flex>
  );
}

interface TreeState {
  [k: string]: {
    showChildren: boolean;
    showAddChild: boolean;
    isSelected: boolean;
  };
}
