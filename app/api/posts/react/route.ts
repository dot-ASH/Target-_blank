import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

type MyData = {
  id: string;
  postid: string;
  reactby: string;
  reactcount: string;
};

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
    INSERT INTO react (postid, reactby)
    VALUES (${res.postid}, ${res.reactby})
  `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const res: MyData = await request.json();

  if (!res) {
    return new NextResponse(
      JSON.stringify({ error: "Please provide something to work for" }),
      { status: 500 }
    );
  }

  try {
    const result =
      await sql`UPDATE posts SET reactcount = ${res.reactcount} WHERE id = ${res.postid}; `;

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
    await sql`UPDATE posts SET reactcount = ${res.reactcount} WHERE id = ${res.postid}; `;
    const result = await sql`DELETE FROM react WHERE id = ${res.id}; `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
