import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

type MyData = {
  id: string;
  postid: string;
  savedby: string;
};

export async function GET() {
  const categories = await sql`SELECT * FROM saved;`;
  return NextResponse.json(categories.rows, { status: 200 });
}

export async function POST(request: NextRequest) {
  const res: MyData = await request.json();

  if (!res) {
    return new NextResponse(
      JSON.stringify({ error: "Please provide something to work for" }),
      { status: 500 }
    );
  }

  try {
    const result = await sql`
    INSERT INTO saved (postid, savedby)
    VALUES (${res.postid}, ${res.savedby})
  `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const res: MyData = await request.json();

  if (!res) {
    return new NextResponse(
      JSON.stringify({ error: "Please provide something to work for" }),
      { status: 500 }
    );
  }

  try {
    const result = await sql`DELETE FROM saved WHERE id = ${res.id}; `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
