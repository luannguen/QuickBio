
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Thiếu họ tên hoặc số điện thoại.' });
    }

    // Định dạng số điện thoại Việt Nam sang định dạng quốc tế E.164 (ví dụ: 0912345678 -> +84912345678)
    let formattedPhone = phone.trim().replace(/\s+/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+84' + formattedPhone.substring(1);
    }
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    const assistantId = process.env.VITE_VAPI_ASSISTANT_ID || 'a97112ea-e910-4ea5-b593-3ea79e5e1639';
    // Đọc Private API Key của Vapi
    const privateKey = process.env.VAPI_PRIVATE_API_KEY || process.env.VITE_VAPI_PRIVATE_API_KEY;
    const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID; // Số điện thoại mua từ Vapi (nếu có)

    if (!privateKey) {
      console.warn('Vapi Outbound: Thiếu VAPI_PRIVATE_API_KEY cấu hình trên Vercel.');
      return res.status(400).json({ 
        success: false, 
        message: 'Tính năng Demo gọi lại yêu cầu cấu hình VAPI_PRIVATE_API_KEY trong biến môi trường Vercel. Bạn hãy dùng nút gọi micro ở góc phải để trò chuyện trực tiếp ngay trên web!' 
      });
    }

    console.log(`Đang gọi API Vapi Outbound đến số: ${formattedPhone} với Assistant: ${assistantId}`);

    const vapiBody: any = {
      assistantId: assistantId,
      customer: {
        number: formattedPhone,
        name: name.trim()
      }
    };

    if (phoneNumberId) {
      vapiBody.phoneNumberId = phoneNumberId;
    }

    const vapiResponse = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${privateKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vapiBody)
    });

    const vapiData = await vapiResponse.json() as any;

    if (vapiResponse.ok) {
      console.log('Vapi Call triggered successfully:', vapiData.id);
      return res.status(200).json({ 
        success: true, 
        message: 'Kích hoạt cuộc gọi thành công!',
        callId: vapiData.id
      });
    } else {
      console.error('Vapi Call trigger failed:', vapiData);
      return res.status(vapiResponse.status).json({ 
        success: false, 
        message: vapiData.message || 'Lỗi từ Vapi khi tạo cuộc gọi.' 
      });
    }
  } catch (error: any) {
    console.error('Outbound Call Exception:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}
