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

  // POST method for inserting data into the Name table
  if (method === "POST" && req.url.includes("name")) {
    const body = await req.json();
    const { column_name, column_tasks, status, email } = body;

    if (!column_name || !column_tasks || !status || !email) {
      return new Response(
        JSON.stringify({
          error:
            "Both 'column_name', 'column_tasks', 'status', and 'email' are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: insertData, error: insertError } = await supabase
      .from("Name")
      .insert([{ column_name, column_tasks, status, email }])
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
  }

  // POST method for inserting data into the User table
  else if (method === "POST" && req.url.includes("user")) {
    const body = await req.json();
    const { first_name, last_name, email } = body;

    if (!first_name || !last_name || !email) {
      return new Response(
        JSON.stringify({
          error: "Both 'first_name', 'last_name', and 'email' are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: insertData, error: insertError } = await supabase
      .from("User")
      .insert([{ first_name, last_name, email }])
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
  }

  // GET method for fetching data from the Name table
  else if (method === "GET" && req.url.includes("name")) {
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
  }

  // GET method for fetching data from the User table
  else if (method === "GET" && req.url.includes("user")) {
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
  }

  // PUT method for updating a record in the Name table
  else if (method === "PUT" && req.url.includes("name")) {
    const { id, column_name, column_tasks, status, email } = await req.json();

    if (!id || !column_name || !column_tasks || !status || !email) {
      return new Response(
        JSON.stringify({
          error:
            "ID, 'column_name', 'column_tasks', 'status', and 'email' are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("Name")
      .update({ column_name, column_tasks, status, email })
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
  }

  // PUT method for updating a record in the User table
  else if (method === "PUT" && req.url.includes("user")) {
    const { id, first_name, last_name, email } = await req.json();

    if (!id || !first_name || !last_name || !email) {
      return new Response(
        JSON.stringify({
          error: "ID, 'first_name', 'last_name', and 'email' are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("User")
      .update({ first_name, last_name, email })
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
  }

  // DELETE method for deleting a record from the Name table (using id)
  else if (method === "DELETE" && req.url.includes("name")) {
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

  // DELETE method for deleting a record from the User table (using id)
  else if (method === "DELETE" && req.url.includes("user")) {
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
