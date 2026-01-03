"use client";

import BasicCard from "@/lib/ui/card/BasicCard";
import { vercelBlobSrc } from "@/lib/constants/vercelBlob";
import {
  Box,
  Button,
  Chip,
  Flex,
  NumberInput,
  Select,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { FaFloppyDisk, FaPlus } from "react-icons/fa6";
import { useImmer } from "use-immer";
import { ITimerState, TAudioSrc, useTimersContext } from "./TimersContext";
import { HH_LIMIT, MM_LIMIT, SS_LIMIT } from "@/lib/constants/limits";

const alerts = vercelBlobSrc.sounds.alerts;

const initialState: IAddTimerState = {
  expiry: 0,
  showMs: false,
  showDetails: false,
  showInfo: false,
  audioSrc: "soft01",
  expirySelect: {},
  validation: {
    status: "untouched",
    messages: [],
  },
};

export default function AddTimer() {
  const [state, setState] = useImmer<IAddTimerState>(initialState);
  const timersCtx = useTimersContext();

  function handleAdd() {
    console.log(state);
    const numTimers = timersCtx.state.timers.length;
    if (state.expiry <= 0) {
      setState((draft) => {
        draft.validation.status = "error";
        draft.validation.messages.push("Expiry should be greater than 0.");
      });
    }
    if (state.validation.status === "success") {
      const timer: ITimerState = {
        id: (numTimers + 1).toString(),
        initialExpiry: state.expiry,
        audioSrc: state.audioSrc,
        status: "running",
        title: state.title,
        showDetails: state.showDetails,
        showInfo: state.showInfo,
        showMs: state.showMs,
      };
      timersCtx.dispatch({ type: "addTimer", timer });
    }
  }

  function handleTimeChange(
    value: string | number,
    timeKey: "hh" | "mm" | "ss",
  ) {
    setState((draft) => {
      draft.expirySelect[timeKey] = value;
      draft.expiry = hhMmSsToMs(
        draft.expirySelect.hh,
        draft.expirySelect.mm,
        draft.expirySelect.ss,
      );
      if (draft.expiry > 0) {
        draft.validation.status = "success";
      }
    });
  }

  function handleTitleChange(value: string) {
    setState((draft) => {
      draft.title = value;
    });
  }

  return (
    <BasicCard maw={300}>
      <Flex direction={"column"} gap={"xs"}>
        <Flex justify="space-between" gap={"xs"}>
          <TimeInput
            state={state}
            label="hh"
            limit={HH_LIMIT}
            handleChange={handleTimeChange}
          />
          <TimeInput
            state={state}
            label="mm"
            limit={MM_LIMIT}
            handleChange={handleTimeChange}
          />
          <TimeInput
            state={state}
            label="ss"
            limit={SS_LIMIT}
            handleChange={handleTimeChange}
          />
        </Flex>

        <Tooltip label="Add">
          <Button variant="light" color="blue" onClick={handleAdd}>
            <FaPlus />
          </Button>
        </Tooltip>

        <Tooltip label="Save">
          <Button variant="light" color="blue">
            <FaFloppyDisk />
          </Button>
        </Tooltip>

        <TextInput
          placeholder="Title"
          onChange={(e) => handleTitleChange(e.target.value)}
        />

        <Select
          clearable
          searchable
          placeholder="Alert tone"
          label="Alert tone"
          data={Object.keys(alerts).map((v) => {
            return { value: v, label: v.toUpperCase().replace("0", " 0") };
          })}
          value={state.audioSrc}
          onChange={(value) => {
            setState((draft) => {
              draft.audioSrc = (value as TAudioSrc) || "soft01";
            });
          }}
        />

        <Flex align="flex-end" justify="space-around" gap={"xs"}>
          <Chip
            onChange={(checked) =>
              setState((draft) => {
                draft.showDetails = checked;
              })
            }
          >
            Details
          </Chip>
          <Chip
            onChange={(checked) =>
              setState((draft) => {
                draft.showInfo = checked;
              })
            }
          >
            Info
          </Chip>
          <Chip
            onChange={(checked) => {
              setState((draft) => {
                draft.showMs = checked;
              });
            }}
          >
            Ms
          </Chip>
        </Flex>
      </Flex>

      {state.validation.status === "error" && (
        <Box mt={"xs"}>
          <Title order={6} c={"red"}>
            Error
          </Title>
          {state.validation.messages.map((message, idx) => {
            return (
              <Text key={idx} c={"red"}>
                {message}
              </Text>
            );
          })}
        </Box>
      )}
    </BasicCard>
  );
}

function TimeInput({
  state,
  label,
  limit,
  handleChange,
}: {
  state: IAddTimerState;
  label: "hh" | "mm" | "ss";
  limit: number;
  handleChange: (value: string | number, timeKey: "hh" | "mm" | "ss") => void;
}) {
  return (
    <NumberInput
      min={0}
      max={limit}
      clampBehavior="strict"
      value={state.expirySelect[label]}
      onChange={(value) => handleChange(value, label)}
      label={label}
      placeholder=""
    />
  );
}

function hhMmSsToMs(
  hh: number | string = 0,
  mm: number | string = 0,
  ss: number | string = 0,
) {
  return (
    Number(hh) * 1000 * 60 * 60 + Number(mm) * 1000 * 60 + Number(ss) * 1000
  );
}

interface IAddTimerState {
  expiry: number;
  title?: string;
  expirySelect: {
    hh?: string | number;
    mm?: string | number;
    ss?: string | number;
  };
  showMs: boolean;
  showDetails: boolean;
  showInfo: boolean;
  audioSrc: TAudioSrc;
  validation: {
    status: "success" | "error" | "untouched";
    messages: string[];
  };
}
