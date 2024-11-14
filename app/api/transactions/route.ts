import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided.' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, SECRET_KEY) as { id: string; status: string };
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
    }

    // Retrieve the user and current transactions
    const user = await prisma.userCreate.findUnique({
      where: { id: decodedToken.id },
      select: { transactions: true, status: true },
    });

    if (!user || (user.status !== 'approved' && user.status !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden: User not approved or admin.' }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check for existing transaction for today
    const existingTransaction = await prisma.dailyTransaction.findFirst({
      where: {
        createdAt: { gte: today },
        userId: decodedToken.id,
      },
    });

    if (existingTransaction) {
      return NextResponse.json({ error: 'A transaction for today already exists.' }, { status: 400 });
    }

    const data = await req.json();
    const requiredFields = [
      'newSavingsAccounts', 'newDPSAccounts', 'newLoanAccounts',
      'oldSavingsAccounts', 'oldDPSAccounts', 'oldLoanAccounts',
      'savingsCollection', 'loanCollectionRegular', 'loanCollectionSMA',
      'loanCollectionCL', 'loanDisbursement', 'savingsWithdrawn',
      'operatingExpenses', 'totalDebitPosting', 'totalCreditPosting',
      'cumulativeProfile'
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        return NextResponse.json({ error: `Field '${field}' is required.` }, { status: 400 });
      }
    }

    // Create a new daily transaction
    const transaction = await prisma.dailyTransaction.create({
      data: {
        newSavingsAccounts: data.newSavingsAccounts,
        newDPSAccounts: data.newDPSAccounts,
        newLoanAccounts: data.newLoanAccounts,
        oldSavingsAccounts: data.oldSavingsAccounts,
        oldDPSAccounts: data.oldDPSAccounts,
        oldLoanAccounts: data.oldLoanAccounts,
        savingsCollection: data.savingsCollection,
        loanCollectionRegular: data.loanCollectionRegular,
        loanCollectionSMA: data.loanCollectionSMA,
        loanCollectionCL: data.loanCollectionCL,
        loanDisbursement: data.loanDisbursement,
        savingsWithdrawn: data.savingsWithdrawn,
        operatingExpenses: data.operatingExpenses,
        totalDebitPosting: data.totalDebitPosting,
        totalCreditPosting: data.totalCreditPosting,
        cumulativeProfile: data.cumulativeProfile,
        status: data.status || 'submit',
        userId: decodedToken.id,
      },
    });

    // Append transaction.id to the user's transactions array
    const updatedTransactions = [...(user.transactions || []), transaction.id];

    // Update the user with the new transactions array
    await prisma.userCreate.update({
      where: { id: decodedToken.id },
      data: {
        transactions: updatedTransactions, // Ensure updatedTransactions is a String[] only
      },
    });

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'An error occurred while creating the transaction.' }, { status: 500 });
  }
}
