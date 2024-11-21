import axios from "axios";

export async function POST(req) {
  try {
    const { agentId, phoneNumber, prompt } = await req.json();

    if (!agentId || !phoneNumber || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://api.retellai.com/v2/create-web-call",
      { agent_id: agentId, phone_number: phoneNumber, prompt },
      {
        headers: {
          Authorization: `Bearer key_667371a201a5967641303658fcad`,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(JSON.stringify({ success: true, data: response.data }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Call failed" }), {
      status: 500,
    });
  }
}
