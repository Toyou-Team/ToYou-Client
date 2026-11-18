// 웹뷰 팝업 차단으로 form POST 페이지 이동
export function openKgInicis(launchUrl: string, launch: Record<string, string>) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = launchUrl;
  form.acceptCharset = 'UTF-8';

  for (const [name, value] of Object.entries(launch)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
