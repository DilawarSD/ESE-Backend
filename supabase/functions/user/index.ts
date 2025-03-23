// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

console.log("Hello user!");

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const { method } = req;

  if (method === "POST") {
    const body = await req.json();

    const { first_name, last_name } = body;

    if (!first_name || !last_name) {
      return new Response(
        JSON.stringify({
          error: "Both 'first_name' and 'last_name' are required.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { data: insertData, error: insertError } = await supabase
      .from("User")
      .insert([{ first_name, last_name }])
      .select();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ inserted: insertData }), {
      headers: { "Content-Type": "application/json" },
    });
  } else if (method === "GET") {
    const { data: fetchData, error: fetchError } = await supabase
      .from("User")
      .select("*");

    if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ fetched: fetchData }), {
      headers: { "Content-Type": "application/json" },
    });
  } else if (method === "PUT") {
    const { id, first_name, last_name } = await req.json();

    if (!id || !first_name || !last_name) {
      return new Response(
        JSON.stringify({
          error: "ID, 'first_name', and 'last_name' are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("User")
      .update({ first_name, last_name })
      .eq("id", id)
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ updated: data }), {
      headers: { "Content-Type": "application/json" },
    });
  } else if (method === "DELETE") {
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID is required to delete." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error } = await supabase.from("User").delete().eq("id", id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Record deleted!" }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
});
