/**
 * Derivado exclusivamente de cinco expressoes do node Dados.
 * Opera em memoria, sem identidade, persistencia ou efeitos externos.
 */
export function normalizeInstagramContent(input = {}) {
  const body = input?.body;
  return {
    event_type: ((() => {
  const event = body?.entry?.[0]?.messaging?.[0] || {};
  if (event.message?.is_deleted === true) return 'message_deleted';
  if (event.message) return 'message';
  if (event.read) return 'read';
  if (event.delivery) return 'delivery';
  if (event.postback) return 'postback';
  return 'unknown';
})()),
    is_status_event: ((() => {
  const event = body?.entry?.[0]?.messaging?.[0] || {};
  return event.message?.is_deleted === true || !!event.read || !!event.delivery;
})()),
    text: ((() => {
  const message = body?.entry?.[0]?.messaging?.[0]?.message || {};
  const rawText = String(message?.text || '').trim();
  if (rawText) return rawText;
  const attachment = Array.isArray(message?.attachments) ? message.attachments[0] : null;
  const type = String(attachment?.type || '').toLowerCase();
  if (type === 'image') return '[imagem recebida]';
  if (type === 'audio') return '[audio recebido]';
  if (type === 'video') return '[video recebido]';
  if (type === 'file') return '[arquivo recebido]';
  return '';
})()),
    message_type: ((() => {
  const message = body?.entry?.[0]?.messaging?.[0]?.message || {};
  if (message?.is_deleted === true) return 'deleted';
  if (message?.is_echo === true) return 'echo';
  const text = String(message?.text || '').trim();
  const attachment = Array.isArray(message?.attachments) ? message.attachments[0] : null;
  const type = String(attachment?.type || '').toLowerCase();
  if (type === 'audio') return 'audio';
  if (type === 'image') return 'image';
  if (type === 'video') return 'video';
  if (type === 'file') return 'file';
  if (type) return 'unsupported';
  if (text) return 'text';
  return 'unknown';
})()),
    message_status: ((() => {
  const event = body?.entry?.[0]?.messaging?.[0] || {};
  if (event.message?.is_deleted === true) return 'deleted';
  if (event.message?.is_echo === true) return 'echo';
  if (event.read) return 'read';
  if (event.delivery) return 'delivered';
  return '';
})()),
  };
}
