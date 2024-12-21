import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
  
    
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/message/send",
        { firstName, lastName, email, phone, message },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container form-component message-form">
      <h2>Send Us A Message</h2>
      <form onSubmit={handleMessage}>
        <div>
          <label htmlFor="first-name">First Name</label>
          <input
            id="first-name"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label htmlFor="last-name">Last Name</label>
          <input
            id="last-name"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="phone">Mobile Number</label>
          <input
            id="phone"
            type="tel"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          rows={7}
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <div style={{  justifyContent: "center", alignItems: "center" }}>
          <button type="submit">Send</button>
        </div>
      </form>
      <img src="/Vector.png" alt="vector" />
    </div>
  );
};

export default MessageForm;
