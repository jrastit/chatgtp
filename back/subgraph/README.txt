1) Change what you want with Notifications
in subgraph/blockgtp/src/PushNotification.ts and
subgraph/blockgtp/src/ contract.ts

2) Resubmit it:

cd subgraph/blockgtp/src/
yarn graph codegen
yarn graph auth --product hosted-service <TOKKEN>
yarn graph deploy --product hosted-service nunux13/blockgtp

and wait more that 15 minutes ...

you can check here:

https://thegraph.com/hosted-service/subgraph/nunux13/blockgtp

3) Opt-in your wallet for receving push

login with your wallet

https://staging.push.org/inbox

search "blockgtp" in channel and clic "opt-in" button

4) Install mobile app and scan QR code to listen pushs

https://play.google.com/store/apps/details?gl=US&hl=en&id=io.epns.epnsstaging&pli=1

or

4bis) Install browser pluggin and import public address of wallet

https://chrome.google.com/webstore/detail/push-staging-protocol-alp/bjiennpmhdcandkpigcploafccldlakj

Debug:

https://thegraph.com/hosted-service/subgraph/nunux13/blockgtp

{
    epnsPushNotifications(first: 20, orderBy: notificationNumber, orderDirection: desc) {
        id
        notificationNumber
        recipient
        notification
    }
}
