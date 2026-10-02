import {NextResponse} from "next/server";

export async function POST(req:Request){
  const secret=process.env.TELEGRAM_WEBHOOK_SECRET;
  if(secret && req.headers.get("x-telegram-bot-api-secret-token")!==secret)
    return NextResponse.json({ok:false},{status:401});
  const update=await req.json();
  console.log("Telegram update",update);
  return NextResponse.json({ok:true});
}
