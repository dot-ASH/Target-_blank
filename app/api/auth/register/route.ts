import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

type MyData = {
  id: string;
  email: string;
  user: string;
  hashpass: string;
  pwd: string;
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
    const hashedPass = await bcrypt.hash(res.pwd, 10);
    const result = sql`INSERT INTO users(email, username, password) VALUES(${res.email}, ${res.user}, ${hashedPass});`;
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
