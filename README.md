# Workflow setup
``npm i`` - all that fun stuff, you know the drill

# Deployment/Setup
See samlify's [docs](https://samlify.js.org/#/key-generation) for information on generating ``assets/encryptionCert.cer`` and ``assets/encryptKey.pem``. Make sure to set a password an configure that password in the environment variables. This allows us to do the very bad practice of storing these keys in Git without worrying too much.

By default, there's already one SP configured which contains the metadata for the lovely SP test site [here](https://sptest.iamshowcase.com/instructions#spinit).

Drop all SP metadata files into ``assets/sp``, feel free to remove ``assets/sp/IAMShowcase`` in production.

## Environment variables
If deploying through CapRover, which is preconfigured for this, set all the needed environment variables in the CapRover dashboard. Documentation found in ``.env.example``

Otherwise, just create a ``.env`` file for development.

- ``PRIVATE_KEY_PASSWORD`` - password set when generating the keypair
- ``PORT`` - port to list on
- ``URL`` - complete URL that the server is running on, make sure to include protocol
- ``DISCORD_CLIENT_ID`` - client ID for Discord application
- ``DISCORD_CLIENT_SECRET`` - client secret for Discord application
- ``GROUP_ID`` - group ID for Roblox group

## Configuring roles
``src/roles.json`` is an array of all roles to assign to corresponding Roblox group ranks. Should be fairly self-explanatory
