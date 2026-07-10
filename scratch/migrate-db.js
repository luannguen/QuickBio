/**
 * Script nâng cấp bảng orders trên Supabase tự động.
 * Hướng dẫn sử dụng:
 * 1. Chạy lệnh: node scratch/migrate-db.js
 * 2. Nhập mật khẩu cơ sở dữ liệu Supabase của bạn khi được yêu cầu.
 */

const { Client } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const projectRef = 'yrrfkdnwjwbwhecgkzps';
const host = `db.${projectRef}.supabase.co`;
const port = 5432;
const database = 'postgres';
const user = 'postgres';

console.log('=== CHƯƠNG TRÌNH NÂNG CẤP DATABASE QUICKBIO ===');
console.log(`Kết nối tới: Host: ${host} | User: ${user}`);

rl.question('Vui lòng nhập mật khẩu cơ sở dữ liệu Supabase của bạn: ', (password) => {
  if (!password.trim()) {
    console.error('Mật khẩu không được để trống.');
    rl.close();
    process.exit(1);
  }

  const connectionString = `postgresql://${user}:${encodeURIComponent(password.trim())}@${host}:${port}/${database}`;
  const client = new Client({ connectionString });

  console.log('\nĐang kết nối tới cơ sở dữ liệu Supabase...');

  client.connect()
    .then(async () => {
      console.log('✓ Kết nối thành công!');
      console.log('Đang chạy câu lệnh nâng cấp bảng orders...');

      const sql = `
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS referred_by TEXT DEFAULT NULL;
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS booking_time TIMESTAMPTZ DEFAULT NULL;
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT DEFAULT NULL;
      `;

      await client.query(sql);
      console.log('🎉 Thành công! Đã nâng cấp bảng orders thành công.');
      
      // Kiểm tra cấu trúc cột sau khi nâng cấp
      const verifySql = `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name IN ('referred_by', 'booking_time', 'customer_phone');
      `;
      const res = await client.query(verifySql);
      console.log('\nCấu trúc cột hiện tại:');
      console.table(res.rows);

      await client.end();
      rl.close();
    })
    .catch((err) => {
      console.error('\n✗ Lỗi kết nối hoặc thực thi SQL:', err.message);
      rl.close();
    });
});
