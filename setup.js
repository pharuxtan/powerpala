const { existsSync, promises: { writeFile, access, mkdir, rm, rename } } = require('fs');
const { join, sep } = require('path');
const { spawn } = require('child_process');

async function getPaladiumAppPath(){
  if(process.platform == "win32"){
    const paladiumPath = join(process.env.LOCALAPPDATA, "Programs", "paladium-group");

    if(!(await existAndPermissions(paladiumPath))){
      console.error("L'injecteur n'arrive pas à trouver le dossier du Paladium Launcher");
      process.exit(0);
    }

    return join(paladiumPath, 'resources', 'app');
  } else if(process.platform == "darwin"){
    const paladiumPath = join('/Applications', `Paladium Launcher.app`);

    if(!(await existAndPermissions(paladiumPath))){
      console.error("L'injecteur n'arrive pas à trouver le dossier du Paladium Launcher");
      process.exit(0);
    }

    return join(paladiumPath, 'Contents', 'Resources', 'app');
  }
}

async function existAndPermissions(path) {
  return access(path).then(() => true).catch(() => false);
}

async function installDependencies() {
  console.log("Installation des modules")
  return new Promise((resolve, reject) => {
    const command = spawn('npm', ['install', '--silent'], {
      cwd: join(__dirname),
      stdio: 'inherit',
      shell: true
    });
    command.on('close', () => resolve());
    command.on('error', err => reject(err));
  });
}

async function compileSvelte() {
  console.log("Compilation du front de Powerpala");
  return new Promise((resolve, reject) => {
    const command = spawn('npm', ['run', 'app:build'], {
      cwd: join(__dirname),
      stdio: 'inherit',
      shell: true
    });
    command.on('close', () => resolve());
    command.on('error', err => reject(err));
  });
}

async function uninject(paladiumAppPath) {
  if (!paladiumAppPath || !existsSync(paladiumAppPath)) {
    console.error(`Powerpala n'a pas l'air injecté`);
    process.exit(0);
  }

  if (!(await existAndPermissions(paladiumAppPath))) {
    console.error(`Powerpala n'a pas pu être injecté suite à une erreur de permissions manquantes. Réessayez avec les permissions d'administrateur`);
    process.exit(0);
  }

  if(existsSync(join(paladiumAppPath, "..", "pala.asar"))) await rename(join(paladiumAppPath, "..", "pala.asar"), join(paladiumAppPath, "..", "app.asar")),

  await rm(paladiumAppPath, {
    recursive: true,
    force: true
  });

  console.log("Powerpala a été désinjecté !");
}

async function inject(paladiumAppPath) {
  const eAp = await existAndPermissions(paladiumAppPath);
  if (eAp) {
    console.warn("Un client semble déjà être injecté merci de faire `npm run setup:uninject` avant.")
    return process.exit(0);
  }

  await installDependencies();
  await compileSvelte();
  await mkdir(paladiumAppPath);
  Promise.all([
    rename(join(paladiumAppPath, "..", "app.asar"), join(paladiumAppPath, "..", "pala.asar")),
    writeFile(join(paladiumAppPath, 'index.js'), `require('${join(__dirname, 'injector').replace(RegExp(sep.repeat(2), 'g'), '/')}');`),
    writeFile(join(paladiumAppPath, 'package.json'), JSON.stringify({
      main: 'index.js',
      name: 'powerpala'
    }, null, 2))
  ]);

  console.log("Powerpala a été correctement injecté !\nRedémarrez le Paladium Launcher pour finir l'installation.")
}

(async () => {
  let paladiumPath = process.argv.slice(3).join(" ");
  if(!(existsSync(paladiumPath) &&
      (process.platform == "win32" && existsSync(join(paladiumPath, "Paladium Launcher.exe")) ||
      (process.platform == "darwin" && path.endsWith(".app"))))){
    paladiumPath = await getPaladiumAppPath();
  }

  if(process.argv[2] == "inject")
    inject(paladiumPath);
  else if(process.argv[2] == "uninject"){
    uninject(paladiumPath)
  }
})();
