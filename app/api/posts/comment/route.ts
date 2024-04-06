import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

type MyData = {
  id: string;
  postid: string;
  comment: string;
  commentby: string;
  commentcount: string;
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
    INSERT INTO comments (postid, commentby, comment)
    VALUES (${res.postid}, ${res.commentby}, ${res.comment})
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
      await sql`UPDATE posts SET commentcount = ${res.commentcount} WHERE id = ${res.postid}; `;

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
    await sql`UPDATE posts SET commentcount = ${res.commentcount} WHERE id = ${res.postid}; `;
    const result = await sql`DELETE FROM comments WHERE id = ${res.id}; `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
