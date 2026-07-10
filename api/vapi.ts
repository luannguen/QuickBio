import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const body = req.body;
    
    // Kiểm tra xem đây có phải là tin nhắn tool-calls của Vapi không
    const message = body?.message;
    if (!message || message.type !== 'tool-calls') {
      return res.status(200).json({ message: 'Ignored: Not a tool-calls request' });
    }

    const toolCalls = message.toolCalls || message.toolCallList || [];
    if (toolCalls.length === 0) {
      return res.status(200).json({ message: 'No tool calls found' });
    }

    // Khởi tạo Supabase Admin Client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase Config');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const results = [];

    for (const toolCall of toolCalls) {
      const toolCallId = toolCall.id;
      const { name: functionName, arguments: args } = toolCall.function;

      // ----------------------------------------------------
      // TOOL 1: Kiểm tra lịch hẹn trống
      // ----------------------------------------------------
      if (functionName === 'check_available_slots') {
        const { date, creator_id } = args;
        
        if (!date || !creator_id) {
          results.push({
            toolCallId,
            result: 'Lỗi: Thiếu thông tin ngày (date) hoặc ID người dùng (creator_id).'
          });
          continue;
        }

        // Định nghĩa khung giờ làm việc chuẩn (9:00 - 17:00)
        const workSlots = ['09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30'];

        // Truy vấn tất cả lịch đã đặt trong ngày này (status !== 'expired')
        const startOfDay = `${date}T00:00:00.000Z`;
        const endOfDay = `${date}T23:59:59.999Z`;

        const { data: bookedOrders, error: queryError } = await supabaseAdmin
          .from('orders')
          .select('booking_time')
          .not('status', 'eq', 'expired')
          .not('booking_time', 'is', null)
          .gte('booking_time', startOfDay)
          .lte('booking_time', endOfDay);

        if (queryError) {
          console.error('Failed to query bookings:', queryError);
          results.push({
            toolCallId,
            result: 'Lỗi hệ thống khi kiểm tra lịch hẹn.'
          });
          continue;
        }

        // Lọc ra các giờ đã bị đặt
        const bookedHours: string[] = [];
        if (bookedOrders) {
          bookedOrders.forEach((order: any) => {
            const timePart = new Date(order.booking_time).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Ho_Chi_Minh'
            });
            bookedHours.push(timePart);
          });
        }

        // Tìm các giờ rảnh
        const availableSlots = workSlots.filter(slot => {
          return !bookedHours.some(booked => booked.includes(slot));
        });

        const resultText = availableSlots.length > 0
          ? `Các khung giờ còn trống trong ngày ${date} là: ${availableSlots.join(', ')}.`
          : `Rất tiếc, ngày ${date} đã kín lịch hẹn. Quý khách vui lòng chọn ngày khác ạ.`;

        results.push({
          toolCallId,
          result: resultText
        });
      }

      // ----------------------------------------------------
      // TOOL 2: Đăng ký đặt lịch & sinh mã VietQR
      // ----------------------------------------------------
      else if (functionName === 'book_appointment') {
        const { name, phone, date_time, creator_id } = args;

        if (!name || !phone || !date_time || !creator_id) {
          results.push({
            toolCallId,
            result: 'Lỗi: Thiếu thông tin tên, số điện thoại, thời gian hẹn hoặc ID người dùng.'
          });
          continue;
        }

        // 1. Tìm sản phẩm phục vụ đặt lịch của Creator (hoặc lấy sản phẩm active đầu tiên)
        const { data: products } = await supabaseAdmin
          .from('products')
          .select('id, name, price')
          .eq('user_id', creator_id)
          .eq('status', 'active')
          .order('created_at', { ascending: true })
          .limit(1);

        const targetProduct = products?.[0];
        if (!targetProduct) {
          results.push({
            toolCallId,
            result: 'Lỗi: Cửa hàng chưa cấu hình dịch vụ sản phẩm nào hoạt động.'
          });
          continue;
        }

        // 2. Sinh mã thanh toán duy nhất dạng: QB + 5 chữ số ngẫu nhiên
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const paymentCode = `QB${randomNum}`;

        // 3. Tạo đơn hàng lịch hẹn dạng pending trong bảng orders
        const { data: newOrder, error: insertError } = await supabaseAdmin
          .from('orders')
          .insert({
            product_id: targetProduct.id,
            customer_name: name.trim(),
            customer_phone: phone.trim(),
            customer_email: `${phone.trim()}@quickbio.app`, // email giả lập
            amount: targetProduct.price,
            payment_code: paymentCode,
            status: 'pending',
            booking_time: date_time
          })
          .select()
          .single();

        if (insertError) {
          console.error('Failed to insert booking order:', insertError);
          results.push({
            toolCallId,
            result: 'Lỗi hệ thống khi ghi nhận lịch hẹn.'
          });
          continue;
        }

        // 4. Lấy cấu hình ngân hàng của Creator
        const { data: bankConfig } = await supabaseAdmin
          .from('sepay_configs')
          .select('*')
          .eq('user_id', creator_id)
          .maybeSingle();

        const activeBank = bankConfig || {
          bank_code: 'MBBank',
          bank_account: '9999999999',
          account_name: 'NGUYEN VAN A'
        };

        // 5. Định dạng lại thời gian hiển thị cho AI đọc
        const formattedDate = new Date(date_time).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'Asia/Ho_Chi_Minh'
        });

        const formattedTime = new Date(date_time).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Ho_Chi_Minh'
        });

        const resultText = `Đặt lịch thành công cho anh/chị ${name} vào lúc ${formattedTime} ngày ${formattedDate}. Quý khách vui lòng chuyển khoản số tiền ${targetProduct.price.toLocaleString('vi-VN')}đ vào ngân hàng ${activeBank.bank_code}, số tài khoản ${activeBank.bank_account}, tên chủ tài khoản ${activeBank.account_name} với nội dung chuyển khoản chính xác là ${paymentCode} để hệ thống tự động xác nhận lịch nhé ạ.`;

        results.push({
          toolCallId,
          result: resultText
        });
      } else {
        results.push({
          toolCallId,
          result: `Lỗi: Không tìm thấy hàm xử lý mang tên ${functionName}.`
        });
      }
    }

    return res.status(200).json({ results });
  } catch (error: any) {
    console.error('Vapi Webhook Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
