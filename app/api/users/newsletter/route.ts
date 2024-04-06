import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

type MyData = {
  newsletter: string;
  id: string;
};

export async function PUT(request: NextRequest) {
  const res: MyData = await request.json();

  if (!res) {
    return new NextResponse(
      JSON.stringify({ error: "Please provide something to search for" }),
      { status: 500 }
    );
  }

  try {
    const result = await sql`UPDATE users
    SET newsletter = ${res.newsletter} 
    WHERE id = ${res.id};`;

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
