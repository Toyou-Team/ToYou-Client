// 앱(웹뷰) <-> 웹 메시지

export const postAppMessage = (type: string) => window.ReactNativeWebView?.postMessage(JSON.stringify({ type }));

// 앱이 보낸 JSON 문자열 중 type 이 같은 것만 꺼낸다
export const parseAppMessage = <T extends { type: string }>(data: unknown, type: T['type']): T | null => {
  if (typeof data !== 'string') return null;

  try {
    const message = JSON.parse(data) as Partial<T>;
    return message.type === type ? (message as T) : null;
  } catch {
    return null;
  }
};
