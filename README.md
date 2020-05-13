# @banyudu/ali-oss-upload

## Install

`npm i -g @banyudu/ali-oss-upload`


## Usage

```bash
Commands:
  ali-oss-upload <local-file> <remote-path>

Options:
  --help, -h             Show help                                     [boolean]
  --version, -v          Show version number                           [boolean]
  --region, -r           oss region, default use OSS_REGION environment variable
                                                                      [required]
  --bucket, -b           oss bucket, default use OSS_BUCKET environment variable
                                                                      [required]
  --accessKeyId, -i      oss access key id, default use OSS_ACCESS_KEY_ID
                         environment variable                         [required]
  --accessKeySecret, -s  oss access key secret, default use
                         OSS_ACCESS_KEY_SECRET environment variable   [required]

```

### demo

`npx @banyudu/ali-oss-upload /path/to/my-file /remote/path -r oss-cn-beijing -b my-awesome-bucket -i my-accsss-key-id -s my-secret`

or 

```bash
export OSS_REGION=oss-cn-beijing
export OSS_BUCKET=my-awesome-bucket
export OSS_ACCESS_KEY_ID=my-access-key-id
export OSS_ACCESS_KEY_SECRET=my-access-key-secret
npx @banyudu/ali-oss-upload /path/to/my-file /remote/path
```
