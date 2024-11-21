"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [agents, setAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const agentsPerPage = 5;

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.retellai.com/list-agents`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer key_667371a201a5967641303658fcad",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching agents: ${response.statusText}`);
        }

        const data = await response.json();
        setAgents(data);
        setTotalPages(Math.ceil(data.length / agentsPerPage));
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = agents.slice(indexOfFirstAgent, indexOfLastAgent);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Agent List</h1>

      <div className="overflow-hidden rounded-lg border border-gray-300">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Agent ID</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Voice</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Loading agents...
                </td>
              </tr>
            ) : currentAgents.length > 0 ? (
              currentAgents.map((agent) => (
                <tr key={agent.agent_id}>
                  <td className="border px-4 py-2">{agent.agent_id}</td>
                  <td className="border px-4 py-2">{agent.agent_name}</td>
                  <td className="border px-4 py-2">{agent.voice_id}</td>
                  <td className="border px-4 py-2">
                    <Link
                      href={`/agent/${agent.agent_id}?voice=${agent.voice_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <p className="text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
