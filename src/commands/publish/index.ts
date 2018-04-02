import * as webpack from 'webpack';
import * as path from 'path';
import * as ghpages from 'gh-pages';
import {green, exec, createWebpackConf } from '../../utils';

export const publish = async () => {
  green('Copying files 📂');

  const indexPath = path.resolve(__dirname, './index.html');
  const appPath = path.resolve(__dirname, '../../../../../');
  const publishDist = `${appPath}/publish_dist`;

  await exec(`mkdir -p ${publishDist}`);
  await exec(`cp ${indexPath} ${publishDist}`);

  green('Creating build 📦');

  const config = createWebpackConf({
    output: {
      path: publishDist,
      filename: 'dist-bundle.js'
    }
  });
  const compiler = webpack(config);

  compiler.run((err, stats) => {
    console.log('err', err);
    console.log('hasErrors', stats.hasErrors());
    console.log(stats.toString())
  });

  green('Publishing build 🚀');

  ghpages.publish(appPath, {
    repo: 'git@github.com:zzarcon/react-progressive-img.git' // TODO: resolve right path
  }, (err: Error) => {
    console.log('publish err', err);
  });
};