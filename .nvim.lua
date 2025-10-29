local wk = require("which-key")

wk.add({
  {
    mode = { "n", "o", "v" },
    { "<leader>px",  group = "Text", nowait = true,             remap = false },
    { "<leader>pxc", "0/ ]<CR>rx",   desc = "Checkmark toggle", nowait = true, remap = false },
  },
})
