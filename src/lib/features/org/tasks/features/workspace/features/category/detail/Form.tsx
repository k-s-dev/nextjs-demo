"use client";

import { InputText } from "@/lib/ui/form/fields/InputText";
import { Button, Flex, Text, Title } from "@mantine/core";
import { useActionState } from "react";
import { categoryUpdateClientAction } from "./clientAction";
import { FaArrowsRotate } from "react-icons/fa6";
import { RichTextInput } from "@/lib/ui/form/fields/RichTextInput";
import {
  TCategoryFormData,
  TCategoryFormState,
} from "@/lib/dataModels/org/category/definitions";
import { Category } from "@/generated/prisma/client";
import FormMessages from "@/lib/ui/form/FormMessages";

export default function CategoryDetailForm({
  category,
  formId,
}: {
  category: Category;
  formId?: string;
}) {
  const formIdFinal = formId || "category-form";

  const initialFormState: TCategoryFormState = {
    data: { ...category } as TCategoryFormData,
  };

  const [formState, formAction, isPending] = useActionState(
    categoryUpdateClientAction.bind(null, category.id),
    initialFormState,
  );

  if (!category) {
    return null;
  }

  return (
    <div>
      <Title order={1} id="category">
        <Text component="span" fz={"h1"}>
          Category: View/Edit Details
        </Text>
      </Title>
      <form id={formIdFinal} action={formAction}>
        <Flex direction={"column"} gap={"xs"}>
          <InputText
            formId={formIdFinal}
            required
            name="name"
            label="Name"
            placeholder="Name"
            defaultValue={formState.data?.name}
            errors={formState.errors?.nested?.name}
          />
          <InputText
            formId={formIdFinal}
            name="order"
            label="Order"
            defaultValue={formState.data?.order?.toString()}
            errors={formState.errors?.nested?.order}
          />
          <Title order={5}>Description</Title>
          <RichTextInput
            textInputProps={{ form: formId, name: "description" }}
            initialValue={formState.data?.description || ""}
          />
          <Flex justify={"flex-end"}>
            <Button
              type="submit"
              form={formIdFinal}
              disabled={isPending}
              color="green"
              variant="light"
              w={100}
            >
              {isPending ? <FaArrowsRotate /> : "Save"}
            </Button>
          </Flex>
          {formState.errors?.nested?.description && (
            <FormMessages
              error
              messages={formState.errors.nested.description}
            />
          )}
          {formState.errors?.root && (
            <FormMessages error messages={formState.errors.root} />
          )}
        </Flex>
      </form>
    </div>
  );
}
