const { createClient } = require('@supabase/supabase-js');

// Nhập biến môi trường
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yrrfkdnwjwbwhecgkzps.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Không tìm thấy SUPABASE_SERVICE_ROLE_KEY trong môi trường.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('--- Đang quét và sửa Page ID trong Database ---');
  
  // 1. Lấy tất cả cài đặt marketing
  const { data: configs, error } = await supabase
    .from('marketing_settings')
    .select('*');
    
  if (error) {
    console.error('Lỗi lấy configs:', error);
    return;
  }
  
  console.log('Các configs hiện tại:', configs);
  
  for (const config of configs) {
    if (config.fb_page_id === '61555170744467') {
      console.log(`Phát hiện cấu hình sai Page ID cho user ${config.user_id}. Đang sửa thành '216518264869897'...`);
      
      const { error: updateError } = await supabase
        .from('marketing_settings')
        .update({ fb_page_id: '216518264869897' })
        .eq('user_id', config.user_id);
        
      if (updateError) {
        console.error('Lỗi cập nhật:', updateError);
      } else {
        console.log('Cập nhật thành công!');
      }
    }
  }
}

run();
