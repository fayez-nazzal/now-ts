import fs from "fs";
import fetch from "cross-fetch";

const readPackageJson = async () => {
  const packageJson = await fs.promises.readFile("package.json", "utf8");

  return JSON.parse(packageJson);
};

// install everything in the package.json inside a folder "installs"
const install = async () => {
    // delete the folder if it exists
    await fs.promises.rm("installs", { recursive: true, force: true });

    // create the folder
    await fs.promises.mkdir("installs");

    // read the package.json
    const packageJson = await readPackageJson();

    // install all the dependencies
    await Promise.all(
        Object.keys(packageJson.dependencies).map(async (dependency) => {
            // install using the network
            const registry = "https://registry.npmjs.org";

            // download using the fetch API
            const url = `${registry}/${dependency}/latest`;

            // download the tarball
            const tarball = await fetch(url).then((res) => res.json());

            // print the tarball file name
            console.log(tarball.dist.tarball);

            // download the tarball
            const tarballFile = await fetch(tarball.dist.tarball).then((res) => (res as any).buffer());

            // write the tarball to the file system
            await fs.promises.writeFile(`installs/${dependency}.tgz`, tarballFile);
        })
    );
};

install();
