/**
 * Derivado exclusivamente de cinco expressoes do node Dados.
 * Opera em memoria, sem identidade, persistencia ou efeitos externos.
 */
export function normalizeWhatsappContent(input = {}) {
  const body = input?.body;
  return {
    event_type: (String(body?.event || body?.event_type || '').toLowerCase()),
    is_status_event: ((() => {
  const event = String(body?.event || '').toLowerCase();
  const status = String(body?.data?.status || '').toLowerCase();
  const hasContent = Boolean(
    body?.data?.message?.conversation ||
    body?.data?.message?.extendedTextMessage?.text ||
    body?.data?.message?.imageMessage ||
    body?.data?.message?.audioMessage ||
    body?.data?.message?.videoMessage ||
    body?.data?.message?.documentMessage
  );

  return /presence|typing|reaction|receipt|message\.update|messages\.update|status/.test(event)
    || ((/delivery|delivered|read|played|ack/.test(status)) && !hasContent);
})()),
    text: (body?.text || body?.message?.text || body?.data?.message?.text || body?.data?.text || body?.data?.body || body?.body || body?.message?.conversation || body?.data?.message?.conversation || body?.data?.message?.extendedTextMessage?.text || body?.caption || ''),
    message_type: ((() => { const payloadType = String(body?.data?.messageType || '').toLowerCase(); const text = String(body?.data?.message?.conversation || body?.data?.message?.extendedTextMessage?.text || body?.text || body?.message?.text || body?.data?.message?.text || body?.data?.text || body?.data?.body || body?.body || body?.caption || ''); const mime = String(body?.mime_type || body?.mimetype || body?.message?.mimetype || body?.data?.message?.mimetype || body?.data?.mimetype || ''); const type = String(body?.type || body?.message_type || body?.data?.type || '').toLowerCase(); if (payloadType === 'conversation') return 'text'; if (/audio/i.test(mime) || type === 'audio') return 'audio'; if (/image/i.test(mime) || type === 'image') return 'image'; if (text) return 'text'; return 'unknown'; })()),
    message_status: (body?.data?.status || ''),
  };
}
