# Steps to start a local backend sever:

1. Download wrangler (a tool used for managing Cloudflare Workers project). 

`$ npm i @cloudflare/wrangler -g`

2. Download the project and navigate to the generated directory.

$ wrangler generate inventory https://github.com/sbmthakur/inventory
$ cd inventory

3. Set your account_id in the wrangler.toml file. You will need a Cloudflare account to do this. Subsequently, you must authorize wrangler to perform actions on your account. 

Wrangler login: https://developers.cloudflare.com/workers/cli-wrangler/commands#login

4. Setup a KV namespace for your application.

$ wrangler kv:namespace create "kv" --preview

The preview option indicates that the namespace is being used for local development. 

This will generate a kv_namespaces array that must be added to the wrangler.toml file. 

5. Initialize the development environment:

$ wrangler dev

This should start a local backend server. Note the port. (8787 by default)
