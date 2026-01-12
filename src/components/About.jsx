import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./About.scss";

const About = () => {
  const formRef = useRef();
  const smileRef = useRef(null);
  const [messageSent, setMessageSent] = useState(false);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_b2rmqwj", "template_e53hbop", formRef.current, "JGwkb25zol28bthUw")
      .then(
        (result) => {
          setMessageSent(true);
          formRef.current.reset();
        },
        (error) => {
          console.error(error.text);
        }
      );
  };

  useEffect(() => {
    let raf = 0;
    const handleMouseMove = (e) => {
      const el = smileRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(6, Math.hypot(dx, dy) / 50);
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setEyePos({ x, y }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="about-container">
      <h2>About Me</h2>
      <p className="about-description">
        Created with ❤️ by <strong>Alfaiz Ali</strong>. <br />
        Passionate about building seamless, user-centric web experiences.
      </p>

      <div className="contact-form-wrapper">
        <div className="smiley-wrapper">
          <div className="smiley" ref={smileRef}>
            <div className="eye left">
              <div
                className="pupil"
                style={{
                  transform: `translate(calc(-50% + ${eyePos.x}px), calc(-50% + ${eyePos.y}px))`,
                }}
              />
            </div>
            <div className="eye right">
              <div
                className="pupil"
                style={{
                  transform: `translate(calc(-50% + ${eyePos.x}px), calc(-50% + ${eyePos.y}px))`,
                }}
              />
            </div>
            <div className="smile" />
          </div>
        </div>

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
