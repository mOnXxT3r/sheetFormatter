import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./About.scss";

const About = () => {
  const formRef = useRef();
  const [messageSent, setMessageSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_b2rmqwj", // Replace with your EmailJS Service ID
        "template_e53hbop", // Replace with your EmailJS Template ID
        formRef.current,
        "JGwkb25zol28bthUw" // Replace with your EmailJS Public Key
      )
      .then(
        (result) => {
          console.log(result.text);
          setMessageSent(true);
          formRef.current.reset();
        },
        (error) => {
          console.error(error.text);
        }
      );
  };

  return (
    <div className="about-container">
      <h2>About Me</h2>
      <p className="about-description">
        Created with ❤️ by <strong>Alfaiz Ali</strong>. <br />
        Passionate about building seamless, user-centric web experiences.
      </p>

      <div className="contact-form-wrapper">
        <h3>Contact Me</h3>
        <form ref={formRef} onSubmit={sendEmail} className="contact-form">
          <input type="text" name="user_name" placeholder="Your Name" required />
          <input type="email" name="user_email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
          {messageSent && <p className="success-message">Message sent successfully!</p>}
        </form>
      </div>
    </div>
  );
};

export default About;
