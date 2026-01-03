import {
  Box,
  Card,
  Checkbox,
  Flex,
  Modal,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useState } from "react";
import { useImmer } from "use-immer";
import {
  deleteCategoryById,
  updateCategoryById,
} from "@/lib/dataModels/org/category/dataAccessLayer";
import FormMessages from "@/lib/ui/form/FormMessages";
import {
  FaAngleDown,
  FaAnglesDown,
  FaAnglesUp,
  FaAngleUp,
} from "react-icons/fa6";
import { Category } from "@/generated/prisma/client";
import { useDisclosure } from "@mantine/hooks";
import CategoryDetailForm from "./detail/Form";
import DeleteModalIcon from "@/lib/ui/form/DeleteModalIcon";
import { AddIcon, SaveIcon, ViewIcon } from "@/lib/ui/icons/TooltipIcons";

export default function EditCategoryRow({
  category,
  open,
  selected,
  isLeaf,
  toggleSelectionAction,
  toggleOpenAction,
  toggleOpenAllAction,
  toggleAddChildAction,
}: {
  category: Category;
  open: boolean;
  selected: boolean;
  isLeaf: boolean;
  toggleSelectionAction: () => void;
  toggleOpenAction: () => void;
  toggleOpenAllAction: () => void;
  toggleAddChildAction: () => void;
}) {
  const [name, setName] = useState(category.name);
  const [order, setOrder] = useState(category.order || 1);
  const [errors, setErrors] = useImmer<string[]>([]);

  async function handleEdit(category: Category) {
    const response = await updateCategoryById(category.id, {
      name,
      order,
    });

    if (response.status === "error") {
      response.errors?.forEach((error) => {
        setErrors((draft) => {
          draft.push(error);
        });
      });
    }
  }

  async function handleDelete() {
    const response = await deleteCategoryById(category.id);

    if (response.status === "error") {
      response.errors?.forEach((error) => {
        setErrors((draft) => {
          draft.push(error);
        });
      });
    }

    return response;
  }

  return (
    <Card shadow="md" p={2} px={"xs"}>
      <Flex gap={"xs"} align={"center"} justify={"space-between"}>
        <Box
          display={"grid"}
          style={{
            gap: ".5rem",
            gridTemplateColumns: "25px 250px 50px",
            alignItems: "center",
          }}
        >
          <Checkbox checked={selected} onChange={toggleSelectionAction} />
          <TextInput
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextInput
            value={order?.toString()}
            onChange={(e) => {
              setOrder(Number(e.target.value));
            }}
          />
        </Box>
        <Flex gap={"xs"} align={"center"}>
          {!isLeaf && (
            <>
              <Tooltip label={open ? "Collapse" : "Expand"}>
                <Text
                  component="span"
                  c={"gray"}
                  fz={"xl"}
                  style={{
                    cursor: "pointer",
                    display: "inline-flex",
                    alignContent: "center",
                  }}
                  onClick={toggleOpenAction}
                >
                  {open ? <FaAngleUp /> : <FaAngleDown />}
                </Text>
              </Tooltip>
              <Tooltip label={open ? "Collapse All" : "Expand All"}>
                <Text
                  component="span"
                  c={"gray"}
                  fz={"xl"}
                  style={{
                    cursor: "pointer",
                    display: "inline-flex",
                    alignContent: "center",
                  }}
                  onClick={toggleOpenAllAction}
                >
                  {open ? <FaAnglesUp /> : <FaAnglesDown />}
                </Text>
              </Tooltip>
            </>
          )}

          <AddIcon action={toggleAddChildAction} label="Toggle add child row" />

          <SaveIcon action={() => handleEdit(category)} />

          <DetailModal category={category} />

          <DeleteModalIcon deleteAction={handleDelete}>
            <Text component="span" fz={"h3"} c={"red"}>
              Confirm to delete category: {category.name}
            </Text>
          </DeleteModalIcon>
        </Flex>
      </Flex>
      {errors.length > 0 && <FormMessages error messages={errors} />}
    </Card>
  );
}

function DetailModal({ category }: { category: Category }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={`Category: ${category.id}`}
        centered
        size="xl"
      >
        <CategoryDetailForm category={category} />
      </Modal>

      <ViewIcon action={open} />
    </>
  );
}
