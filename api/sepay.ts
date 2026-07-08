import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Thông tin từ SePay gửi về
    // Tham khảo: https://my.sepay.vn/docs/webhook
    const data = req.body;

    // Supabase Admin Client (Bypass RLS)
    // Phải cấu hình VITE_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY trong Vercel Environment Variables
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase Service Key');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const transferAmount = parseInt(data.transferAmount, 10) || 0;
    const content = data.content || '';
    const transactionId = data.id || `TX_${Date.now()}`;

    // Tìm mã giao dịch (Payment Code) trong nội dung chuyển khoản
    // Format quy ước của chúng ta: QB + 5 số (VD: QB12345)
    const orderMatch = content.match(/QB\d{5}/i);
    
    if (!orderMatch) {
      console.log('Không tìm thấy mã đơn hàng trong nội dung:', content);
      return res.status(200).json({ message: 'Ignored: No order code found' });
    }

    const paymentCode = orderMatch[0].toUpperCase();

    // Tìm đơn hàng tương ứng trong DB kèm thông tin sản phẩm
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, products(*)')
      .eq('payment_code', paymentCode)
      .eq('status', 'pending')
      .single();

    if (orderError || !order) {
      console.log('Không tìm thấy đơn hàng pending cho mã:', paymentCode);
      return res.status(200).json({ message: 'Order not found or already paid' });
    }

    // Kiểm tra số tiền có khớp không (để tránh thanh toán thiếu)
    if (transferAmount < order.amount) {
      console.log(`Thanh toán thiếu tiền. Cần: ${order.amount}, Nhận: ${transferAmount}`);
      return res.status(200).json({ message: 'Insufficient amount' });
    }

    // Cập nhật trạng thái đơn hàng thành 'paid'
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: 'paid', 
        paid_at: new Date().toISOString() 
      })
      .eq('id', order.id);

    if (updateError) {
      throw updateError;
    }

    // Nếu là đơn hàng nâng cấp Pro
    if (order.product_id === '00000000-0000-0000-0000-000000000001') {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ plan: 'pro' })
        .eq('email', order.customer_email);
      
      if (profileError) {
        console.error('Lỗi khi nâng cấp Pro:', profileError);
      } else {
        console.log(`Đã nâng cấp tài khoản Pro thành công cho: ${order.customer_email}`);
      }

      // Xử lý hoa hồng giới thiệu SaaS 30% trọn đời cho Creator đã mời
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('referred_by_creator')
        .eq('email', order.customer_email)
        .maybeSingle();
      
      if (profile && profile.referred_by_creator) {
        const commissionAmount = Math.round(order.amount * 0.5);
        const { error: commError } = await supabaseAdmin
          .from('commissions')
          .insert({
            affiliate_id: profile.referred_by_creator,
            order_id: order.id,
            amount: commissionAmount,
            status: 'pending'
          });
        if (commError) {
          console.error('Lỗi khi ghi hoa hồng giới thiệu Pro:', commError);
        } else {
          console.log(`Đã ghi nhận hoa hồng giới thiệu Pro ${commissionAmount}đ cho Creator: ${profile.referred_by_creator}`);
        }
      }
    }

    // Nếu đơn hàng có người giới thiệu, tự động ghi nhận hoa hồng 50%
    if (order.referred_by) {
      const commissionAmount = Math.round(order.amount * 0.5);
      const { error: commissionError } = await supabaseAdmin
        .from('commissions')
        .insert({
          affiliate_id: order.referred_by,
          order_id: order.id,
          amount: commissionAmount,
          status: 'pending'
        });
      if (commissionError) {
        console.error('Lỗi khi ghi nhận hoa hồng:', commissionError);
      } else {
        console.log(`Đã ghi nhận hoa hồng ${commissionAmount}đ cho CTV: ${order.referred_by}`);
      }
    }

    // Ghi lại lịch sử giao dịch vào bảng transactions
    await supabaseAdmin
      .from('transactions')
      .insert({
        order_id: order.id,
        gateway: 'sepay',
        transaction_id: transactionId,
        amount: transferAmount,
        content: content,
        transfer_type: data.transferType || 'in',
        account_number: data.accountNumber
      });

    // Gửi email giao hàng tự động qua Resend nếu có API Key
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const productName = order.products?.name || 'Sản phẩm số';
        const fileUrl = order.products?.file_url || '#';
        
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'QuickBio <onboarding@resend.dev>', // Resend sandbox default address
            to: order.customer_email,
            subject: `🎉 [QuickBio] Xác nhận thanh toán & Giao sản phẩm: ${productName}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; line-height: 1.7; color: #1e293b; background-color: #ffffff;">
                <h2 style="color: #f97316; margin-top: 0; font-size: 20px;">Cảm ơn bạn đã mua hàng tại QuickBio!</h2>
                <p>Xin chào <strong>${order.customer_name}</strong>,</p>
                <p>Giao dịch chuyển khoản cho đơn hàng <strong>${paymentCode}</strong> đã được xác nhận thành công.</p>
                
                <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #f1f5f9;">
                  <h3 style="margin-top: 0; color: #0f172a; font-size: 16px;">Chi tiết sản phẩm:</h3>
                  <p style="margin: 8px 0; font-size: 14px;"><strong>Sản phẩm:</strong> ${productName}</p>
                  <p style="margin: 8px 0; font-size: 14px;"><strong>Số tiền:</strong> ${transferAmount.toLocaleString('vi-VN')}đ</p>
                  
                  <a href="${fileUrl}" style="display: inline-block; background-color: #f97316; color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; margin-top: 15px; font-size: 14px;" target="_blank">
                    📥 Tải File Sản Phẩm Ngay
                  </a>
                </div>
                
                <p style="font-size: 12px; color: #64748b;">Nếu nút trên không hoạt động, bạn có thể copy link sau dán vào trình duyệt: <br> <a href="${fileUrl}" style="color: #f97316;">${fileUrl}</a></p>
                
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">Hệ thống giao hàng tự động QuickBio - Chúc bạn một ngày tốt lành!</p>
              </div>
            `
          })
        });

        if (!emailResponse.ok) {
          const errData = await emailResponse.json();
          console.error('Lỗi từ Resend API:', errData);
        } else {
          console.log(`Đã gửi email giao hàng thành công đến: ${order.customer_email}`);
        }
      } catch (emailErr) {
        console.error('Lỗi khi gửi email bàn giao:', emailErr);
      }
    } else {
      console.log('Bỏ qua gửi email: Chưa cấu hình biến môi trường RESEND_API_KEY');
    }

    console.log(`Đã xác nhận thanh toán thành công cho đơn hàng: ${paymentCode}`);
    return res.status(200).json({ success: true, message: 'Order paid successfully' });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
