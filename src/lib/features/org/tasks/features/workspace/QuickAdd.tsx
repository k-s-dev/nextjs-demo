"use client";

import { createWorkspace } from "@/lib/dataModels/org/workspace/dataAccessLayer";
import { Button, Flex, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import * as v from "valibot";
import { VSName } from "@/lib/dataModels/org/workspace/definitions";

export default function AddWorkspaceQuick() {
  type TIssue = v.InferIssue<typeof VSName>;

  const [name, setName] = useState<string>("");
  const [error, setError] = useState<TIssue[] | { message: string }[] | null>(
    null,
  );
  const [status, setStatus] = useState<
    "untouched" | "touched" | "error" | "pending" | "success"
  >("untouched");

  async function handleSubmit() {
    const validation = v.safeParse(VSName, name);

    if (validation.success) {
      setError(null);
      setName(validation.output);
      setStatus("pending");
      const response = await createWorkspace(validation.output, );
      if (response.status === "error") {
        setStatus("error");
        if (response.errors) {
          setError(
            response.errors?.map((error) => {
              return { message: error };
            }),
          );
        }
      }
      if (response.status === "success") {
        setStatus("success");
        setTimeout(() => {
          setStatus("untouched");
          setName("");
        }, 2000);
      }
    } else {
      setError(validation.issues);
    }
  }

  return (
    <>
      <Flex gap={"xs"} wrap={"wrap"}>
        <TextInput
          required
          name="name"
          placeholder="Name ..."
          value={name}
          error={error?.map((e) => (
            <span key={e.message}>{e.message}</span>
          ))}
          onChange={(e) => {
            setName(e.currentTarget.value);
            setStatus("touched");
          }}
          style={{ flexGrow: 99999 }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSubmit()}
          disabled={status === "pending"}
          style={{ flexGrow: 1 }}
        >
          Add Workspace
          {status === "pending" && (
            <Text mx={"xs"}>
              <FaArrowsRotate />
            </Text>
          )}
        </Button>
      </Flex>
      {status === "success" && (
        <Text bg={"green.1"} my={"xs"} p={"xs"} w={"fit-content"}>
          Workspace created successfully.
        </Text>
      )}
    </>
  );
}
