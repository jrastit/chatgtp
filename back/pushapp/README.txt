1) Prepare the code to send pushs:

After cloning, do 'yarn install'
then copy .env.sample into .env and add your private channel key.

2) Prepare wallet to receive pushs

Go to https://staging.push.org/channels and login with your wallet you want receive pushs.

Search for channel "blockgtp" and clic on "opt-in" button to allow pushs reception.

Install chrome extension to get pushs from staging and login with your wallet.

https://chrome.google.com/webstore/detail/push-staging-protocol-alp/bjiennpmhdcandkpigcploafccldlakj

3) run cli command:

node src/push.js "Title" "Payload"

4) check inside the chrome extension you get your push message !!!
