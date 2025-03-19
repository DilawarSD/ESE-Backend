import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

console.log("Hello from Functions!");

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const { method } = req;

  if (method === "POST") {
    const body = await req.json();

    const { column_name, column_tasks } = body;

    if (!column_name || !column_tasks) {
      return new Response(
        JSON.stringify({
          error: "Both 'column_name' and 'column_tasks' are required.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { data: insertData, error: insertError } = await supabase
      .from("Name")
      .insert([{ column_name, column_tasks }])
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
      .from("Name")
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
    const { id, column_name, column_tasks } = await req.json();

    if (!id || !column_name || !column_tasks) {
      return new Response(
        JSON.stringify({
          error: "ID, 'column_name', and 'column_tasks' are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("Name")
      .update({ column_name, column_tasks })
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

    const { error } = await supabase.from("Name").delete().eq("id", id);

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
