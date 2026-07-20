import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    
    // 1. Nhận diện API Key từ Header của SePay (thường là Authorization: Apikey <key>)
    const authHeader = req.headers['authorization'] || req.headers['apikey'] || '';
    const receivedApiKey = authHeader.replace(/^Apikey\s+/i, '').trim();

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase Service Key');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const transferAmount = parseInt(data.transferAmount, 10) || 0;
    const content = data.content || '';
    // [TSK-03] Tránh việc lấy Date.now() làm ID, dùng ID thực của giao dịch (nếu có)
    const transactionId = data.id ? String(data.id) : `TX_${Date.now()}_${Math.random()}`; 

    // Kiểm tra nâng cấp tài khoản trước khi khớp mã đơn hàng thông thường
    const upgradeMatch = content.match(/UPGRADE\s+PRO\s+(\S+@\S+)/i);
    if (upgradeMatch) {
      const email = upgradeMatch[1].trim().toLowerCase();
      console.log('Phát hiện giao dịch nâng cấp PRO cho email:', email);

      // 1. Tìm profile theo email
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', email)
        .maybeSingle();

      if (profileError || !profile) {
        console.error('Không tìm thấy tài khoản để nâng cấp cho email:', email, profileError);
        return res.status(200).json({ message: 'Ignored: User profile not found for upgrade' });
      }

      // Kiểm tra số tiền chuyển khoản tối thiểu (ví dụ gói Pro là 199.000đ, cho phép từ 150k trở lên)
      if (transferAmount < 150000) {
        console.log(`Số tiền ${transferAmount} không đủ để nâng cấp PRO cho ${email}`);
        return res.status(200).json({ message: 'Ignored: Insufficient amount for upgrade' });
      }

      // 2. Cập nhật gói dịch vụ thành 'pro'
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ plan: 'pro' })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Lỗi khi nâng cấp gói pro:', updateError);
        return res.status(500).json({ message: 'Database error upgrading plan' });
      }

      // 3. Ghi log transaction nâng cấp
      await supabaseAdmin.from('transactions').insert({
        transaction_id: transactionId,
        amount: transferAmount,
        content: content,
        transfer_type: 'in'
      });

      // 4. Gửi email xác nhận nâng cấp thành công
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        const emailPayload = {
          from: 'QuickBio <onboarding@resend.dev>', 
          to: email,
          subject: `🎉 Chúc mừng bạn đã nâng cấp thành công gói QuickBio PRO!`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #f97316;">Xin chào ${profile.full_name || 'Creator'}!</h2>
              <p>Tài khoản của bạn đã được nâng cấp lên gói <strong>PRO</strong> thành công.</p>
              <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin-top: 15px;">
                <p><strong>Gói dịch vụ:</strong> QuickBio Pro</p>
                <p><strong>Tính năng đã mở khóa:</strong></p>
                <ul>
                  <li>Không giới hạn số lượng trang Bio và sản phẩm</li>
                  <li>Ẩn hoàn toàn Logo thương hiệu QuickBio</li>
                  <li>Công cụ kéo thả (Drag & Drop) nâng cao</li>
                  <li>Sử dụng Tên miền riêng (Custom Domain)</li>
                </ul>
              </div>
              <p style="margin-top: 20px; font-size: 13px; color: #64748b;">Chúc bạn có nhiều đơn hàng cùng QuickBio!</p>
            </div>
          `
        };

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailPayload),
            signal: controller.signal
          });
          clearTimeout(timeout);
          console.log(`Đã gửi email nâng cấp thành công đến: ${email}`);
        } catch (emailErr) {
          console.error('Lỗi khi gửi email chúc mừng:', emailErr);
        }
      }

      console.log(`Nâng cấp PRO THÀNH CÔNG cho: ${email}`);
      return res.status(200).json({ success: true, message: 'Profile upgraded to pro successfully' });
    }

    const orderMatch = content.match(/QB\d{5}/i);
    
    if (!orderMatch) {
      console.log('Không tìm thấy mã đơn hàng trong nội dung:', content);
      return res.status(200).json({ message: 'Ignored: No order code found' });
    }

    const paymentCode = orderMatch[0].toUpperCase();

    // 2. Tìm đơn hàng để xác định chủ sở hữu (Creator)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, amount, status, products(user_id, name, file_url)')
      .eq('payment_code', paymentCode)
      .eq('status', 'pending')
      .single();

    if (orderError || !order || !order.products) {
      console.log('Không tìm thấy đơn hàng pending cho mã:', paymentCode);
      return res.status(200).json({ message: 'Order not found or already paid' });
    }

    // 3. [TSK-02] Xác minh Webhook API Key của Creator
    const creatorId = order.products.user_id;
    const { data: sepayConfig } = await supabaseAdmin
      .from('sepay_configs')
      .select('api_key')
      .eq('user_id', creatorId)
      .maybeSingle();

    if (!sepayConfig || !sepayConfig.api_key) {
      console.log(`Creator ${creatorId} chưa cấu hình SePay API Key, từ chối Webhook.`);
      return res.status(401).json({ message: 'Unauthorized: Missing API Key Config' });
    }

    if (receivedApiKey !== sepayConfig.api_key) {
      console.log('Sai SePay API Key!');
      return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
    }

    // Kiểm tra số tiền
    if (transferAmount < order.amount) {
      console.log(`Thanh toán thiếu tiền. Cần: ${order.amount}, Nhận: ${transferAmount}`);
      return res.status(200).json({ message: 'Insufficient amount' });
    }

    // 4. [TSK-01] & [TSK-03] Đẩy toàn bộ logic vào Database Transaction (RPC)
    const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('process_sepay_payment', {
      p_payment_code: paymentCode,
      p_amount: transferAmount,
      p_transaction_id: transactionId,
      p_content: content,
      p_gateway: 'sepay',
      p_transfer_type: data.transferType || 'in',
      p_account_number: data.accountNumber || ''
    });

    if (rpcError) {
      console.error('Lỗi khi gọi RPC process_sepay_payment:', rpcError);
      return res.status(500).json({ message: 'Database transaction failed' });
    }

    if (!rpcResult.success) {
      console.warn('Transaction bị từ chối từ Database:', rpcResult.message);
      // Trả 200 để Webhook ngừng retry nếu lỗi là do duplicate
      return res.status(200).json({ message: rpcResult.message });
    }

    // 5. [TSK-05] Xử lý Email không block luồng quá lâu (Giới hạn timeout)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const productName = order.products?.name || 'Sản phẩm số';
      const fileUrl = order.products?.file_url || '#';
      
      const emailPayload = {
        from: 'QuickBio <onboarding@resend.dev>', 
        to: rpcResult.customer_email,
        subject: `🎉 [QuickBio] Xác nhận thanh toán & Giao sản phẩm: ${productName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #f97316;">Cảm ơn bạn đã mua hàng!</h2>
            <p>Giao dịch cho đơn hàng <strong>${paymentCode}</strong> đã được xác nhận thành công.</p>
            <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px;">
              <p><strong>Sản phẩm:</strong> ${productName}</p>
              <a href="${fileUrl}" style="display: inline-block; background-color: #f97316; color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; margin-top: 15px;" target="_blank">📥 Tải File Ngay</a>
            </div>
          </div>
        `
      };

      try {
        // Dùng AbortController để chặn timeout gửi email quá 3s
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailPayload),
          signal: controller.signal
        });
        clearTimeout(timeout);
        console.log(`Đã gửi email đến: ${rpcResult.customer_email}`);
      } catch (emailErr) {
        console.error('Lỗi timeout hoặc mạng khi gửi email (Đơn hàng vẫn thành công):', emailErr);
      }
    }

    console.log(`Xác nhận thanh toán THÀNH CÔNG cho mã: ${paymentCode}`);
    return res.status(200).json({ success: true, message: 'Order paid successfully' });

  } catch (error: any) {
    console.error('Webhook Uncaught Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
