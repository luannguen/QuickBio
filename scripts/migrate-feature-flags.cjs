const { Client } = require('pg');
const connectionString = "postgres://postgres.yrrfkdnwjwbwhecgkzps:Garankfc%40%231397445@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";

async function migrate() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log("Creating dev_feature_flags table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS dev_feature_flags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        flag_key TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        is_enabled BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log("Adding RLS policies...");
    await client.query(`
      ALTER TABLE dev_feature_flags ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Allow select for all" ON dev_feature_flags;
      CREATE POLICY "Allow select for all" ON dev_feature_flags
        FOR SELECT USING (true);

      DROP POLICY IF EXISTS "Allow all for authenticated" ON dev_feature_flags;
      CREATE POLICY "Allow all for authenticated" ON dev_feature_flags
        FOR ALL TO authenticated USING (true) WITH CHECK (true);
    `);

    console.log("Seeding initial feature flags...");
    await client.query(`
      INSERT INTO dev_feature_flags (flag_key, name, description, is_enabled)
      VALUES 
        ('dev-control-v2', 'Developer Control Center V2', 'Giao diện trung tâm kiểm soát lập trình viên phiên bản 2.0', true),
        ('enable-public-registration', 'Đăng ký tài khoản công khai', 'Cho phép người dùng tự do đăng ký tài khoản mới trên hệ thống', false)
      ON CONFLICT (flag_key) DO NOTHING;
    `);

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

migrate();
