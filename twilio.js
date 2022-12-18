import twilio from "twilio";

const twilioSecret = JSON.parse(
  await wixSecretsBackend.getSecret("twilioSecret")
);
const accountSID = twilioSecret.key;
const authToken = twilioSecret.senderEmail;
const twilioNumber = twilioSecret.twilioNumber;

export async function sendSms(phone_to, msg) {
  let client = new twilio(accountSID, authToken);
  try {
    let message = await client.messages.create({
      body: msg,
      to: `whatsapp:${phone_to}`,
      from: `whatsapp:${twilioNumber}`,
    });
  } catch (e) {
    console.log("Twillio Error: ", e);
  }
}
