/**
 * SMS delivery for client cabinet login codes.
 *
 * Provider: SMS.ru (set SMS_RU_API_ID). When no provider is configured the code
 * is logged server-side and, if a Telegram admin bot is set up, forwarded there
 * so the site still works during setup. Replace with a real provider for prod.
 *
 * Env:
 *   SMS_RU_API_ID     — SMS.ru API id (https://sms.ru)
 *   TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID — fallback notification channel
 */

export async function sendSmsCode(phone: string, code: string): Promise<void> {
  const text = `Код входа на сайт КАЛИБР: ${code}`;
  void text;

  // ─────────────────────────────────────────────────────────────────────────
  // ВРЕМЕННО ОТКЛЮЧЕНО: реальная отправка СМС через SMS.ru.
  // Раскомментируйте блок ниже и задайте SMS_RU_API_ID, когда подключите
  // провайдера. Пока код НЕ отправляется по СМС — см. fallback ниже.
  // ─────────────────────────────────────────────────────────────────────────
  // const apiId = process.env.SMS_RU_API_ID;
  // if (apiId) {
  //   try {
  //     const url = new URL("https://sms.ru/sms/send");
  //     url.searchParams.set("api_id", apiId);
  //     url.searchParams.set("to", phone);
  //     url.searchParams.set("msg", text);
  //     url.searchParams.set("json", "1");
  //     const res = await fetch(url, { method: "POST" });
  //     const data = (await res.json()) as { status?: string };
  //     if (data.status !== "OK") {
  //       console.error("[sms] SMS.ru returned non-OK status:", data);
  //     }
  //     return;
  //   } catch (err) {
  //     console.error("[sms] SMS.ru send failed:", err);
  //   }
  // }

  // Fallback: отправка СМС отключена — логируем код и дублируем в Telegram.
  console.warn(`[sms] SMS sending disabled. Code for ${phone}: ${code}`);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Код входа в кабинет для ${phone}: ${code}`,
      }),
    }).catch((e) => console.error("[sms] telegram fallback failed:", e));
  }
}
