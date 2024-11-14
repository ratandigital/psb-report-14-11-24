// app/api/users/[id]/lock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('lock/unlock');
  const { id } = params;
  const { status } = await req.json();

  try {
    const updatedUser = await prismadb.userCreate.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error locking/unlocking user:', error);
    return NextResponse.json({ message: 'Error locking/unlocking user' }, { status: 500 });
  }
}
