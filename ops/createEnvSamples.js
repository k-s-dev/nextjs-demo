const glob = require("glob");
const fs = require("node:fs");
const path = require("path");

const DST_DIR = "env_samples";
const GLOB_PATTERN=".env*"

main();

function main() {
  const dst = path.join(".", DST_DIR);
  checkDstDir(dst);
  const envFiles = getEnvFiles(GLOB_PATTERN);
  const dstFiles = overwriteDstFiles(envFiles, dst);
  refactorDstFiles(dstFiles);
}

function checkDstDir(dst) {
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst);
  }
}

function getEnvFiles(pattern) {
  return glob.sync(pattern, {
    dot: true,
  });
}

function overwriteDstFiles(envFiles, dst) {
  const dstFiles = envFiles.map((envFile) => {
    const dstFile = path.join(dst, envFile);
    fs.copyFileSync(envFile, dstFile);
    return dstFile;
  });
  return dstFiles;
}

function refactorDstFiles(dstFiles) {
  dstFiles.forEach((f) => {
    const content = fs.readFileSync(f, "utf8").split("\n");
    let newContent = [];
    content.forEach((line) => {
      const eqIndex = line.search("=");
      let newLine = line;
      if (eqIndex !== -1) {
        newLine = line.slice(0, line.search("=") + 1);
      }
      newContent.push(newLine);
    });
    newContent = newContent.join("\n");
    fs.writeFileSync(f, newContent, {
      flag: "w+"
    });
  });
}
