import axios from "axios";

export async function POST(req) {
  try {
    const { agentId, prompt } = await req.json();

    if (!agentId || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://api.retellai.com/chat",
      { agent_id: agentId, prompt },
      {
        headers: {
          Authorization: `Bearer YOUR_RETELL_AI_API_KEY`,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(JSON.stringify({ success: true, data: response.data }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Chat failed" }), {
      status: 500,
    });
  }
}
