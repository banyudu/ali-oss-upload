#!/usr/bin/env node
const OSS = require('ali-oss')
const yargs = require('yargs')
const chalk = require('chalk')
const fs = require('fs')
const AgentKeepalive = require('agentkeepalive')

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
    .option('input', {
      demandOption: false,
      describe: 'upload multiple files with an input file. Seperate local file and remote path with one space, one file per line.'
    })
    .alias('help', 'h')
    .alias('version', 'v')
    .argv

const agent = new AgentKeepalive({
  maxSockets: 3
});

const ossClient = new OSS({
  region: argv.region,
  accessKeyId: argv.accessKeyId,
  accessKeySecret: argv.accessKeySecret,
  bucket: argv.bucket,
  agent,
  timeout: 180000
});

const upload = async (local, remote) => {
  console.log(local)
  await ossClient.put(remote, local, {
    headers: {
      'Cache-Control': argv.cacheControl || 'no-cache'
    }
  })
}

const todo = []

if (argv.input) { // multiple files
  const fileContent = fs.readFileSync(argv.input, 'utf8')
  const lines = fileContent.split('\n')
  for (const line of lines) {
    const match = line.match(/\s*([^\s]+)\s+([^\s]+)\s*$/)
    if (match) {
      todo.push({
        local: match[1],
        remote: match[2]
      })
    }
  }
} else {
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
  todo.push({
    local: localFile,
    remote: remotePath
  })
}

(async () => {
  await Promise.all(todo.map(item => upload(item.local, item.remote)))
  // for (const item of todo) {
    // await upload(item.local, item.remote)
  // }
})().catch(err => {
  console.error(err)
  process.exit(1)
})
