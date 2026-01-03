"use client";

import {
  createTheme,
  DEFAULT_THEME,
  MantineColorsTuple,
  mergeMantineTheme,
} from "@mantine/core";

const blue: MantineColorsTuple = [
  "#eaf3ff",
  "#d7e2f9",
  "#aec3ed",
  "#81a1e2",
  "#5c85d8",
  "#4573d3",
  "#376ad1",
  "#2959ba",
  "#204fa7",
  "#104495"
];

const indigo: MantineColorsTuple = [
  "#f1efff",
  "#dfddf6",
  "#bdb8e5",
  "#9891d4",
  "#796fc5",
  "#6358bc",
  "#5b4fba",
  "#4b41a4",
  "#423994",
  "#373084",
];

const purple: MantineColorsTuple = [
  "#f5eeff",
  "#e5dbf7",
  "#c6b4e8",
  "#a68bd9",
  "#8b68cc",
  "#7a51c5",
  "#6f42c1",
  "#6138ac",
  "#56319a",
  "#4a2889",
];

const pink: MantineColorsTuple = [
  "#ffeae8",
  "#ffd5d2",
  "#f8aaa4",
  "#f17c73",
  "#ec5649",
  "#e93c2d",
  "#e82f20",
  "#cf2114",
  "#b91a0f",
  "#a20d09"
]

const red: MantineColorsTuple = [
  "#ffeced",
  "#f8dbdb",
  "#e7b6b7",
  "#d68e8f",
  "#c86c6e",
  "#c05658",
  "#bd4b4e",
  "#a73c3f",
  "#963337",
  "#85292d"
]

const orange: MantineColorsTuple = [
  "#fff2e3",
  "#ffe4cf",
  "#f9c8a1",
  "#f4a261",
  "#f19044",
  "#ef8029",
  "#ef7819",
  "#d5660c",
  "#be5906",
  "#a64b00"
]

const yellow: MantineColorsTuple = [
  "#fff8e4",
  "#faefd2",
  "#f3dda7",
  "#e9c46a",
  "#e5ba51",
  "#e1af38",
  "#dfaa29",
  "#c6951b",
  "#b08412",
  "#997101"
]

const green: MantineColorsTuple = [
  "#f4fae8",
  "#e9f1da",
  "#d3e0b9",
  "#bbce95",
  "#a8bf77",
  "#9bb562",
  "#94b057",
  "#7f9b46",
  "#708a3b",
  "#5f772e"
]

const teal: MantineColorsTuple = [
  "#e4fcf7",
  "#d8f2ed",
  "#b7e1d8",
  "#93cfc3",
  "#74c1b1",
  "#61b8a6",
  "#53b39f",
  "#419d8b",
  "#348c7b",
  "#1e7a69"
]

const cyan: MantineColorsTuple = [
  "#dffeff",
  "#ccf7ff",
  "#9eebfb",
  "#6ce0f7",
  "#46d6f4",
  "#2dd0f2",
  "#0dcaf0",
  "#00b5d8",
  "#00a2c2",
  "#008cab"
]

const themeOverride = createTheme({
  autoContrast: true,
  primaryColor: "green",
  colors: {
    blue,
    indigo,
    purple,
    pink,
    red,
    orange,
    yellow,
    green,
    teal,
    cyan,
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
