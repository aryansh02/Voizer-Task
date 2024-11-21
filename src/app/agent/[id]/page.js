"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import axios from "axios";

export default function AgentDetailPage({ params }) {
  const [agentId, setAgentId] = useState(null);
  const [agentData, setAgentData] = useState({
    name: "Agent Name",
    prompt: "This is the agent's default prompt.",
  });

  const [activeIcon, setActiveIcon] = useState("voice");
  const [activeTab, setActiveTab] = useState("call");
  const searchParams = useSearchParams();
  const [chatMessage, setChatMessage] = useState("");
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [enteredName, setEnteredName] = useState("");
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setAgentId(resolvedParams.id);

      const voice = searchParams.get("voice") || "11labs-Agent";
      const agentName = voice.split("-")[1] || "Agent";
      setAgentData((prev) => ({ ...prev, name: agentName }));
    })();
  }, [params, searchParams]);

  const handleAutoSave = useCallback(
    (field, value) => {
      setAgentData((prev) => ({ ...prev, [field]: value }));

      if (debounceTimer) clearTimeout(debounceTimer);

      const newTimer = setTimeout(async () => {
        try {
          await axios.post("/api/update-agent", {
            agentId,
            field,
            value,
          });
          console.log(`Autosaved ${field}: ${value}`);
        } catch (error) {
          console.error(`Failed to autosave ${field}:`, error);
        }
      }, 1000);

      setDebounceTimer(newTimer);
    },
    [debounceTimer, agentId]
  );

  const handleCall = async () => {
    if (!enteredPhoneNumber) {
      alert("Please enter a phone number!");
      return;
    }

    try {
      const response = await fetch("/api/test-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: enteredName,
          phoneNumber: enteredPhoneNumber,
          prompt: agentData.prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to initiate call: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Call response:", result);
      alert("Call initiated successfully!");
    } catch (error) {
      console.error("Error initiating call:", error);
      alert("Failed to initiate call. Please try again.");
    }
  };

  const handleChat = async () => {
    if (!chatMessage) {
      alert("Please enter a message!");
      return;
    }

    try {
      const response = await fetch("/api/test-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: chatMessage,
          prompt: agentData.prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send chat: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Chat response:", result);
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending chat:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  if (!agentId) {
    return <div>Loading...</div>;
  }

  const renderSidebarContent = () => {
    switch (activeIcon) {
      case "voice":
        return (
          <>
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-black">Select Voice</h4>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search Voice/Language"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center text-gray-600 mb-2">
                <hr className="w-full border-t border-gray-300" />
                <span className="px-2 text-sm">English</span>
                <hr className="w-full border-t border-gray-300" />
              </div>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Marie</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Female
                  </span>
                </button>
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Sarah</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Female
                  </span>
                </button>
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Mark</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Male
                  </span>
                </button>
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Sam</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Male
                  </span>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center text-gray-600 mb-2">
                <hr className="w-full border-t border-gray-300" />
                <span className="px-2 text-sm">French</span>
                <hr className="w-full border-t border-gray-300" />
              </div>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Marie</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Female
                  </span>
                </button>
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Sarah</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Female
                  </span>
                </button>
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Mark</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Male
                  </span>
                </button>
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Sam</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Male
                  </span>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center text-gray-600 mb-2">
                <hr className="w-full border-t border-gray-300" />
                <span className="px-2 text-sm">Spanish</span>
                <hr className="w-full border-t border-gray-300" />
              </div>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Marie</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Female
                  </span>
                </button>
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Sarah</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Female
                  </span>
                </button>
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Mark</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Male
                  </span>
                </button>
                <button className="w-full px-4 py-2 bg-violet-100 text-black rounded flex justify-between items-center">
                  <span className="font-bold">Sam</span>
                  <span className="bg-indigo-700 text-white px-2 py-1 rounded-full text-xs">
                    Male
                  </span>
                </button>
              </div>
            </div>
          </>
        );
      case "settings":
        return (
          <>
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-black">Settings</h4>
            </div>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-gray-200 text-black rounded-2xl">
                Profile
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 text-black rounded-2xl">
                User Settings
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 text-black rounded-2xl">
                General Settings
              </button>
            </div>
          </>
        );
      case "calendar":
        return (
          <>
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-black">Calendar</h4>
            </div>
            <p className="text-gray-600">No events scheduled.</p>
          </>
        );
      case "analytics":
        return (
          <>
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-black">Analytics</h4>
            </div>
            <p className="text-gray-600">Analytics data will appear here.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="w-full bg-indigo-600 text-white p-4 flex justify-center items-center">
        <input
          type="text"
          className="bg-indigo-600 text-white px-2 py-1 rounded text-center w-1/3"
          value={agentData.name}
          onChange={(e) => handleAutoSave("name", e.target.value)}
        />
      </div>

      <div className="flex flex-1">
        <div className="w-14 bg-gray-200 flex flex-col items-center py-4 border-r">
          <img
            src="/images/icon1.png"
            alt="Voice Icon"
            className={`w-11 h-11 mb-6 object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 ${
              activeIcon === "voice" ? "bg-indigo-100" : ""
            }`}
            onClick={() => setActiveIcon("voice")}
          />
          <img
            src="/images/icon2.png"
            alt="Settings Icon"
            className={`w-11 h-11 mb-6 object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 ${
              activeIcon === "settings" ? "bg-indigo-100" : ""
            }`}
            onClick={() => setActiveIcon("settings")}
          />
          <img
            src="/images/icon3.png"
            alt="Calendar Icon"
            className={`w-11 h-11 mb-6 object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 ${
              activeIcon === "calendar" ? "bg-indigo-100" : ""
            }`}
            onClick={() => setActiveIcon("calendar")}
          />
          <img
            src="/images/icon4.png"
            alt="Analytics Icon"
            className={`w-11 h-11 object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 ${
              activeIcon === "analytics" ? "bg-indigo-100" : ""
            }`}
            onClick={() => setActiveIcon("analytics")}
          />
        </div>

        <div className="w-1/6 bg-white p-4 border-r h-[calc(100vh)] overflow-auto">
          {renderSidebarContent()}
        </div>

        <div className="flex-1 p-6 bg-white">
          <div className="mt-6">
            <label className="block text-lg font-bold text-black mb-3">
              Name
            </label>
            <textarea
              className="mb-6 w-full p-3 text-black border border-black rounded-xl"
              value={agentData.name}
              onChange={(e) => handleAutoSave("name", e.target.value)}
            />
            <label className="block text-lg font-bold text-black mb-3">
              Prompt
            </label>
            <textarea
              className="w-full p-3 text-black border border-black rounded-xl"
              value={agentData.prompt}
              rows={8}
              onChange={(e) => handleAutoSave("prompt", e.target.value)}
            />
          </div>
        </div>

        <div className="w-1/5 bg-white p-6 border-l">
          <div className="flex items-center mb-6">
            <button
              className={`px-4 py-2 rounded-l-md ${
                activeTab === "call"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setActiveTab("call")}
            >
              Test Call
            </button>
            <button
              className={`px-4 py-2 rounded-r-md ${
                activeTab === "chat"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setActiveTab("chat")}
            >
              Test Chat
            </button>
          </div>

          {activeTab === "call" && (
            <div className="space-y-4">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded bg-purple-100 text-purple-800"
                value={selectedPhoneNumber}
                onChange={(e) => setSelectedPhoneNumber(e.target.value)}
              >
                <option value="" disabled>
                  Select Phone Number
                </option>
                <option value="+911234567890">+91 123-456-7890</option>
                <option value="+919876543210">+91 987-654-3210</option>
              </select>

              <input
                type="text"
                placeholder="Enter Name"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-violet-200 text-purple-800"
                value={enteredName}
                onChange={(e) => setEnteredName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Enter Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-violet-200 text-purple-800"
                value={enteredPhoneNumber}
                onChange={(e) => setEnteredPhoneNumber(e.target.value)}
              />

              <button
                className="w-full px-4 py-2 bg-indigo-700 text-white rounded"
                onClick={handleCall}
              >
                Call Me
              </button>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="space-y-4">
              <textarea
                className="w-full h-36 px-3 py-2 border border-gray-300 rounded bg-violet-200 text-purple-800"
                placeholder="Type your message here..."
                onChange={(e) => setChatMessage(e.target.value)}
              ></textarea>
              <button
                className="w-full px-4 py-2 bg-indigo-700 text-white rounded"
                onClick={handleChat}
              >
                Send Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
