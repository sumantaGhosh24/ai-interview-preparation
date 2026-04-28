"use client";

import {sendEmail} from "@/lib/email/send-email";
import {Button} from "@/components/ui/button";

// export const metadata = {
//   title: "Home",
// };

const Home = () => {
  const handleSendEmail = async () => {
    await sendEmail({
      to: "sumantaghosh9574@gmail.com",
      subject: "Test",
      html: "<h1>Hello World</h1>",
      text: "Hello World",
    });
  };

  return (
    <div>
      <h1>Home</h1>
      <Button onClick={handleSendEmail}>Send Email</Button>
    </div>
  );
};

export default Home;
