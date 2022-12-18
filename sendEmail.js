import sgMail from "@sendgrid/mail";
import wixSecretsBackend from "wix-secrets-backend";
import { emailTemplate } from "backend/template.jsw";
const { Pool } = require("pg");

// Saving user email to Cockroach DB
// Along with their interests
async function saveToDB(email, interests) {
  const dbSecret = JSON.parse(await wixSecretsBackend.getSecret("dbSecret"));
  const db_url = dbSecret.db_url;

  const connectionString = db_url;

  const pool = new Pool({
    connectionString,
    application_name: "$ docs_simplecrud_node-postgres",
  });

  // Connect to database
  const client = await pool.connect();

  await client.query(
    `INSERT INTO users (email, interests) VALUES ('${email}', '${interests}');`,
    (err, val) => {
      if (err) {
        console.log(err);
      } else {
        console.log(val);
      }
    }
  );
}

export async function sendEmail(recipient, subject, body) {
  try {
    const sendGridSecret = JSON.parse(
      await wixSecretsBackend.getSecret("sendGridSecret")
    );
    const key = sendGridSecret.key;
    const senderEmail = sendGridSecret.senderEmail;

    sgMail.setApiKey(key);

    const msg = {
      from: senderEmail,
      to: recipient,
      subject: subject,
      html: emailTemplate(senderEmail, body),
    };

    await saveToDB(recipient, body);

    return await sgMail.send(msg);
  } catch (error) {
    console.log("Error sending the email: " + error.message);
    return false;
  }
}
