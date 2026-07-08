const pageId = '216518264869897';
const token = 'EAAPcRTlrpD0BRx1kZCBSzS09GSsrFGFsTJBgQBgggaUGHqczzX5TdcyvCYT1xNDsp5fmtvdNYAOjwZAZB0ED4eVsNrYYMNaWMkgN2cJnRcp363XmZAoZAvqx3yksBuVONeGfP8x8eN14HWjeOAfcFWhtTZAUYKZBNhJ8lZC1irZBemFVempWN4OoUZCHrZBKg3oZCcnF3grchZCLZBO8NGuZBnyuwwm6ghaZCN9qUzcOBIFnwxv1FfcZD';

async function run() {
  console.log('\n--- Thử đăng bài lên Page ID thực tế 216518264869897 ---');
  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        message: 'QuickBio AI AutoPost Test - Kết nối tự động thành công rực rỡ! 🎉',
        access_token: token
      }).toString()
    });
    const data = await response.json();
    console.log('Result for post /feed:', data);
  } catch (err) {
    console.error('Error post /feed:', err);
  }
}

run();
