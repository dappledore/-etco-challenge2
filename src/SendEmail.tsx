const CONFIG = {
  SENDGRIDURL: "https://api.sendgrid.com/v3/mail/send",
};
export default function sendGridEmail(
  to: string,
  from: string,
  subject: string,
  body: string,
  type = "text/plain"
) {
  const isSuccess = sendEmail(
    "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",
    to,
    from,
    subject,
    body,
    type
  );
  return isSuccess;
}
function sendEmail(
  key: String,
  to: string,
  from: string,
  subject: string,
  body: string,
  type: string
) {
  return fetch(CONFIG.SENDGRIDURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + key,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          subject: subject,
        },
      ],
      from: {
        email: from,
      },
      content: [
        {
          type: type,
          value: body,
        },
      ],
    }),
  })
    .then((response) => {
      console.log(JSON.stringify(response));
      return true;
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
      return false;
    });
}
