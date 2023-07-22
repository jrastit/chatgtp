import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

if (process.argv.length < 3)
{
   console.error("Usage: node src/push.js 'Title' 'Payload'");
   process.exit(-1)
}

const PK = process.env.WALLET_PRIVATE_KEY;

const Pkey = `0x${PK}`;
const _signer = new ethers.Wallet(Pkey);

const sendNotification = async() => {
  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer: _signer,
      type: 1, // broadcast
      identityType: 2, // direct payload
      notification: {
        title: `[SDK-TEST] notification TITLE:`,
        body: `[sdk-test] notification BODY`
      },
      payload: {
        title: process.argv[2],
        body: process.argv[3],
        cta: '',
        img: ''
      },
      channel: 'eip155:5:0xfFBD116ed9A20b9006ED59309189c7112Ff90bEC', // your channel address
      env: 'staging'
    });
   console.log('Push sent !!!');
  } catch (err) {
    console.error('Error: ', err);
  }
}

sendNotification();
