#!/usr/bin/env node
const OSS = require('ali-oss')
const yargs = require('yargs')
const chalk = require('chalk')

const error = (msg, exit = false) => {
  console.error(chalk.red(msg))
  console.log('')
  if (exit) {
    process.exit(1)
  }
}

const argv =
  yargs
    .command('<local-file> <remote-path>')
    .option('region', {
      alias: 'r',
      demandOption: true,
      default: process.env.OSS_REGION,
      describe: 'oss region, default use OSS_REGION environment variable'
    })
    .option('bucket', {
      alias: 'b',
      demandOption: true,
      default: process.env.OSS_BUCKET,
      describe: 'oss bucket, default use OSS_BUCKET environment variable'
    })
    .option('accessKeyId', {
      alias: 'i',
      demandOption: true,
      default: process.env.OSS_ACCESS_KEY_ID,
      describe: 'oss access key id, default use OSS_ACCESS_KEY_ID environment variable'
    })
    .option('accessKeySecret', {
      alias: 's',
      demandOption: true,
      default: process.env.OSS_ACCESS_KEY_SECRET,
      describe: 'oss access key secret, default use OSS_ACCESS_KEY_SECRET environment variable'
    })
    .option('cacheControl', {
      alias: 'c',
      demandOption: false,
      describe: 'cache-control, default no-cache'
    })
    .alias('help', 'h')
    .alias('version', 'v')
    .argv

const localFile = argv._[0]
const remotePath = argv._[1]

if (!localFile || !remotePath) {
  error('local-file and remote-path required!')
  yargs.showHelp()
  process.exit(1)
}

if (argv._.length > 2) {
  error('Too many arguments!')
  yargs.showHelp()
  process.exit(1)
}

const ossClient = new OSS({
  region: argv.region,
  accessKeyId: argv.accessKeyId,
  accessKeySecret: argv.accessKeySecret,
  bucket: argv.bucket
});

(async () => {
  await ossClient.put(remotePath, localFile, {
    headers: {
      'Cache-Control': argv.cacheControl || 'no-cache'
    }
  })
})().catch(console.error)