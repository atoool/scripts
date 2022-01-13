// const {execSync} = require('child_process');
const {unlinkSync, copyFileSync, rmSync, mkdirSync} = require('fs');
const replace = require('replace-in-file');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

// const cmd1 = 'git checkout master && git branch -d ';

const onInit = async () => {
  const appName = await read('app name: ');
  // const bName = read('branch name: ');
  const packId = await read('pack id: ');
  const iconLoc = '../../release-works/' + (await read('app folder name: '));
  const keyStore = await read('keystore file name: ');

  // // const output1 = execSync(cmd1 + bName, {encoding: 'utf-8'});
  // // console.log(output1);

  readline.close();

  await replacePackName(appName).then(
    async () =>
      await replacePackId(packId).then(
        async () =>
          await replaceIcons(iconLoc).then(
            async () =>
              await replaceKeyStore(iconLoc, keyStore).then(
                async () => await replaceFolders(packId),
              ),
          ),
      ),
  );
};

const replacePackName = name => {
  const files = [
    './android/app/src/main/res/values/strings.xml',
    './src/locale/en.json',
  ];

  const fromString1 = `Healthy Recipes`;
  const from1 = new RegExp(fromString1, 'g');

  const to1 = `${name}`;
  console.warn(to1);

  const from = [from1];
  const to = [to1];

  return new Promise((resolve, reject) => {
    for (let i = 0; i < 2; i++) {
      const options = {
        files: files[i],
        from,
        to,
      };
      replace(options)
        .then(() => {
          console.log('📦 appname ✅' + i);
          i === 1 && resolve();
        })
        .catch(() => console.log('🛑 Error Updating 📦 appname' + i));
    }
  });
};

const replacePackId = id => {
  const files = [
    './android/app/_BUCK',
    './android/app/build.gradle',
    './android/app/src/debug/java/healthy/recipes/mealplans/ReactNativeFlipper.java',
    './android/app/src/main/AndroidManifest.xml',
    './android/app/src/main/java/healthy/recipes/mealplans/MainActivity.java',
    './android/app/src/main/java/healthy/recipes/mealplans/MainApplication.java',
    './src/utils/constants.js',
  ];

  const fromString1 = `healthy.recipes.mealplans`;
  const from1 = new RegExp(fromString1, 'g');
  const to1 = `${id}`;
  console.warn(to1);

  const from = [from1];
  const to = [to1];

  return new Promise((resolve, reject) => {
    for (let i = 0; i < 7; i++) {
      const options = {
        files: files[i],
        from,
        to,
      };
      replace(options)
        .then(() => {
          console.log(`📦 ${files[i]} ✅`);
          i === 6 && resolve();
        })
        .catch(() => console.log(`🛑 Error Updating 📦 ${files[i]}`));
    }
  });
};

const replaceIcons = iconPath => {
  try {
    const comPath = './android/app/src/main/res';
    const paths = [
      '/drawable/tv_banner.png',
      '/drawable/bootsplash_logo.png',
      '/mipmap-hdpi/ic_launcher_round.png',
      '/mipmap-hdpi/ic_launcher.png',
      '/mipmap-mdpi/ic_launcher_round.png',
      '/mipmap-mdpi/ic_launcher.png',
      '/mipmap-xhdpi/ic_launcher_round.png',
      '/mipmap-xhdpi/ic_launcher.png',
      '/mipmap-xxhdpi/ic_launcher_round.png',
      '/mipmap-xxhdpi/ic_launcher.png',
      '/mipmap-xxxhdpi/ic_launcher_round.png',
      '/mipmap-xxxhdpi/ic_launcher.png',
    ];
    for (let i = 0; i < 16; i++) {
      unlinkSync(comPath + paths[i]);
    }
    for (let i = 0; i < 16; i++) {
      copyFileSync(iconPath + paths[i], comPath + paths[i]);
    }
    console.log('📦 icons updated ✅');
    return new Promise((resolve, reject) => {
      resolve();
    });
  } catch (e) {
    console.log('🛑 Error Updating 📦 icons', e);
  }
};

const replaceKeyStore = (keyPath, keyname) => {
  try {
    const oldPath = './android/app/healthyrecipes.jks';

    unlinkSync(oldPath);
    copyFileSync(keyPath + '/' + keyname, './android/app/' + keyname);

    const files = './android/gradle.properties';

    const fromString1 = `MYAPP_UPLOAD_STORE_FILE=healthyrecipes.jks`;
    const from1 = new RegExp(fromString1, 'g');
    const fromString2 = `MYAPP_UPLOAD_KEY_ALIAS=healthyrecipes`;
    const from2 = new RegExp(fromString2, 'g');

    const to1 = `MYAPP_UPLOAD_STORE_FILE=${keyname}`;
    const to2 = `MYAPP_UPLOAD_KEY_ALIAS=${keyname.split('.')[0]}`;
    console.warn(to2);
    const from = [from1, from2];
    const to = [to1, to2];

    const options = {
      files,
      from,
      to,
    };

    replace(options);
    console.log('📦 keystore ✅');
    return new Promise((resolve, reject) => {
      resolve();
    });
  } catch {
    console.log('🛑 Error Updating 📦 keystore');
  }
};

const replaceFolders = packId => {
  try {
    const comPath1 = './android/app/src/main/java';
    const comPath2 = './android/app/src/debug/java';
    const midPath = '/healthy/recipes/mealplans/';
    const files = [
      'MainActivity.java',
      'MainApplication.java',
      'ReactNativeFlipper.java',
    ];
    const newPath = packId.split('.');
    const newPathLength = newPath?.length;
    let newMidPath = '';
    for (let i = 0; i < newPathLength; i++) {
      newMidPath = newMidPath + '/' + newPath[i];
    }
    mkdirSync(comPath1 + newMidPath, {recursive: true});
    mkdirSync(comPath2 + newMidPath, {recursive: true});
    copyFileSync(
      comPath1 + midPath + files[0],
      comPath1 + newMidPath + '/' + files[0],
    );
    copyFileSync(
      comPath1 + midPath + files[1],
      comPath1 + newMidPath + '/' + files[1],
    );
    copyFileSync(
      comPath2 + midPath + files[2],
      comPath2 + newMidPath + '/' + files[2],
    );
    const baseDir = '/healthy';
    rmSync(comPath1 + baseDir, {recursive: true});
    rmSync(comPath2 + baseDir, {recursive: true});
    console.log('📦 Folders updated ✅');
    return new Promise((resolve, reject) => {
      resolve();
    });
  } catch (e) {
    console.log('🛑 Error Updating 📦 folders', e);
  }
};

const read = label => {
  return new Promise((resolve, reject) => {
    readline.question(label, arg => {
      resolve(arg);
    });
  });
};

onInit();
