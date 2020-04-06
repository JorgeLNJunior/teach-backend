'use strict'

const Helpers = use('Helpers')
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default disk
  |--------------------------------------------------------------------------
  |
  | The default disk is used when you interact with the file system without
  | defining a disk name
  |
  */
  default: 'azure',

  disks: {
    /*
    |--------------------------------------------------------------------------
    | Local
    |--------------------------------------------------------------------------
    |
    | Local disk interacts with the a local folder inside your application
    |
    */
    local: {
      root: Helpers.tmpPath(),
      driver: 'local'
    },

    /*
    |--------------------------------------------------------------------------
    | Azure
    |--------------------------------------------------------------------------
    |
    | Azure disk interacts with a container on Azure blob storage
    |
    */
    azure: {
      driver: 'azure', // Required
      container: Env.get('AZURE_CONTAINER'), // Required

      // There is 4 diffent way to connect to blob storage shown below

      // 1. Either SAS or use `UseDevelopmentStorage=true` for local development
      connection_string: Env.get('AZURE_CONNECTION_STRING'),

      // 2. Remote storage emulator
      key: Env.get('AZURE_KEY'), // Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
      name: Env.get('AZURE_SECRET'), // devstoreaccount1
      // local_address below is used to find the remote emulator
      local_address: Env.get('AZURE_LOCAL_ADDRESS'), // 'http://192.168.0.2:10000/devstoreaccount1'

      // 3. Azure blob storage
      key: Env.get('AZURE_KEY'),
      name: Env.get('AZURE_SECRET'),

      // 4. Azure AD (Not tested, might work, no promise)
      azure_tenant_id: Env.get('AZURE_TENANT_ID'),
      azure_client_id: Env.get('AZURE_CLIENT_ID'),
      azure_client_secret: Env.get('AZURE_CLIENT_SECRET'),
    },

    /*
    |--------------------------------------------------------------------------
    | S3
    |--------------------------------------------------------------------------
    |
    | S3 disk interacts with a bucket on aws s3
    |
    */
    s3: {
      driver: 's3',
      key: Env.get('S3_KEY'),
      secret: Env.get('S3_SECRET'),
      bucket: Env.get('S3_BUCKET'),
      region: Env.get('S3_REGION')
    }
  }
}
