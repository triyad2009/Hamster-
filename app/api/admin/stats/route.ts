import {NextResponse} from "next/server";
export async function GET(){
  // Replace this placeholder with a service-role Supabase query after
  // authenticating an admin Telegram ID/session.
  return NextResponse.json({users:0,coins:0,ads:0,pendingWithdrawals:0});
}
