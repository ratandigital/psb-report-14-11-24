import prismadb from "@/lib/prismadb";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Array to hold error messages
    const errors: string[] = [];

    // Validate required fields before processing
    const { email, phone, upazila, branchCode } = data;
    let branchCodeInt = parseInt(branchCode);

    // Collect errors if any
    if (!email || !phone || !upazila || !branchCode) {
      errors.push('All fields are required');
    }

    // Check if branchCode is a valid number
    if (typeof branchCodeInt !== 'number' || isNaN(branchCodeInt)) {
      errors.push('branchCode must be a valid number');
    }

    // Check for an existing user with the same email
    const existingEmail = await prismadb.userCreate.findFirst({
      where: { email: data.email },
    });

    if (existingEmail) {
      errors.push('Email already exists, ');
    }
 
    // Check for an existing user with the same phone
    const existingPhone = await prismadb.userCreate.findFirst({
      where: { phone: data.phone },
    });

    if (existingPhone) {
      errors.push('Phone already exists, ');
    }

    // Check for an existing user with the same upazila
    const existingUpazila = await prismadb.userCreate.findFirst({
      where: { upazila: data.upazila },
    });

    if (existingUpazila) {
      errors.push('Upazila already exists, ');
    }

    // Check for an existing user with the same branchCodes
    const existingBranchCode = await prismadb.userCreate.findFirst({
      where: { branchCode: branchCodeInt },
    });

    if (existingBranchCode) {
      errors.push('Branch code already exists');
    }

    // If there are any validation errors, return them
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Create the user if no duplicate is found and no validation errors
    const user = await prismadb.userCreate.create({
      data: {
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        division: data.division,
        district: data.district,
        upazila: data.upazila,
        branchCode: data.branchCode,
        status: 'pending',
      },
    });

    return NextResponse.json(user);

  } catch (error: unknown) {
    // Handle unexpected errors
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    } else {
      console.error("An unexpected error occurred");
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
  }
}

