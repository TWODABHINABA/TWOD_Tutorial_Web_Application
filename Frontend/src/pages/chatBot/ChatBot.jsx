import { useEffect, useState } from "react";
import api from "../../components/User-management/api";
import TypewriterText from "./TypewriterText";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! What are your interests?", sender: "bot" },
  ]);

  const [input, setInput] = useState("");
  const [userData, setUserData] = useState({
    interests: "",
    researchField: "",
    strengths: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [awaitingFeedback, setAwaitingFeedback] = useState(false);
  const toggleChat = () => setIsOpen(!isOpen);

  // const sendMessage = async () => {
  //   if (!input.trim()) return;

  //   if (awaitingFeedback) {
  //     if (input.toLowerCase() === "yes") {
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { text: "Glad to help! 😊", sender: "bot" },
  //         { text: "What else can I assist you with?", sender: "bot" },
  //       ]);
  //     } else {
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { text: "Okay, let's start again!", sender: "bot" },
  //         { text: "What are your interests?", sender: "bot" },
  //       ]);
  //       setUserData({ interests: "", researchField: "", strengths: "" });
  //     }
  //     setAwaitingFeedback(false);
  //     setInput("");
  //     return;
  //   }

  //   const updatedData = { ...userData };
  //   let nextQuestion = "";

  //   if (!userData.interests) {
  //     updatedData.interests = input;
  //     nextQuestion = "Got it! What's your research field?";
  //   } else if (!userData.researchField) {
  //     updatedData.researchField = input;
  //     nextQuestion = "Awesome! What are your strongest skills?";
  //   } else {
  //     updatedData.strengths = input;

  //     try {
  //       const response = await api.post("/recommend", updatedData);
  //       const { reply, courses } = response.data;

  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { text: input, sender: "user" },
  //         {
  //           text: reply,
  //           sender: "bot",
  //           courses: courses.map((course) => ({
  //             name: course.name,
  //             courseType: course.courseType,
  //           })),
  //         },
  //         { text: "Was this helpful? (Yes/No)", sender: "bot" },
  //       ]);
  //       setAwaitingFeedback(true);
  //     } catch (error) {
  //       console.error("Error fetching recommendations:", error);
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { text: input, sender: "user" },
  //         {
  //           text: `⚠️ Unable to fetch courses. ${
  //             error.response?.data?.message || "Try again later."
  //           }`,
  //           sender: "bot",
  //         },
  //       ]);
  //     }

  //     setInput("");
  //     return;
  //   }

  //   setUserData(updatedData);
  //   setMessages((prevMessages) => [
  //     ...prevMessages,
  //     { text: input, sender: "user" },
  //     { text: nextQuestion, sender: "bot" },
  //   ]);
  //   setInput("");
  // };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();

    // Show user's message immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userText, sender: "user" },
    ]);

    setInput("");

    try {
      const response = await api.post("/chatbot", { userMessage: userText });
      const { reply } = response.data;

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: reply, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "⚠️ Something went wrong. Please try again later.",
          sender: "bot",
        },
      ]);
    }
  };

  useEffect(() => {
    setMessages([{ text: "Hi! How can I help you today?", sender: "bot" }]);
  }, []);

  const fetchCourseId = async (courseName, courseType) => {
    try {
      const response = await api.get(
        `/courses?name=${courseName}&courseType=${courseType}`
      );
      return response.data._id;
    } catch (error) {
      console.error("Error fetching course ID:", error);
    }
  };

  console.log(messages);
  return (
    <>
      <button
        className="fixed bottom-5 right-5 bg-orange-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-orange-600 transition duration-300"
        onClick={toggleChat}
      >
        💬 Chat
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-lg rounded-lg border border-gray-300">
          <div className="bg-orange-500 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
            <span className="font-semibold">AI Tutor Chat</span>
            <button className="text-lg font-bold" onClick={toggleChat}>
              ×
            </button>
          </div>

          <div className="p-4 max-h-64 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[90%] break-words whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-orange-100 text-right ml-auto"
                    : "bg-gray-200 text-left mr-auto"
                }`}
              >
                {msg.sender === "bot" ? (
                  <TypewriterText text={msg.text} />
                ) : (
                  msg.text
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center p-3 border-t border-gray-300">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="ml-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

{
  /* <div className="p-4 max-h-64 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[90%] break-words whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-orange-100 text-right ml-auto"
                    : "bg-gray-200 text-left mr-auto"
                }`}
              >
                {msg.text}
                {msg.sender === "bot" ? (
                  <TypewriterText text={msg.text} />
                ) : (
                  msg.text
                )}
                {msg.sender === "bot" && msg.courses && (
                  <ul className="mt-2 space-y-2">
                    {msg.courses.map((course, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                      >
                        <span>
                          {course.name} ({course.courseType})
                        </span>

                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            const id = await fetchCourseId(
                              course.name,
                              course.courseType
                            );
                            if (id) window.location.href = `/courses/${id}`;
                          }}
                          className="text-orange-500 hover:underline text-sm"
                        >
                          ➝ View
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div> */
}
