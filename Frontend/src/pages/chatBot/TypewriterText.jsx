import { useState, useEffect } from "react";

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!text) return;
    let index = 0;
    setDisplayText("");

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Adjust speed if needed

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
};

export default TypewriterText;
