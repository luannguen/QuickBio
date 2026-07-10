import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const fallbackGeminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

export default async function handler(req: any, res: any) {
  // Cho phép cả GET (cron job) và POST (manual test)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const isTest = req.method === 'POST' && req.body?.test === true;

    // 1. Nếu là yêu cầu chạy thử (Test) từ Dashboard
    if (isTest) {
      const { fb_page_id, fb_page_token, style, product_name, product_desc, gemini_api_key, bio_url } = req.body;

      if (!fb_page_id || !fb_page_token) {
        return res.status(400).json({ message: 'Thiếu cấu hình Facebook Page ID hoặc Access Token' });
      }

      const activeGeminiKey = gemini_api_key || fallbackGeminiKey;
      if (!activeGeminiKey) {
        return res.status(400).json({ message: 'Thiếu API Key của Gemini. Vui lòng cấu hình.' });
      }

      // Tự động phân giải Page ID chuẩn từ Token (tránh lỗi ID hiển thị/profile bị sai)
      let realPageId = fb_page_id;
      try {
        const meRes = await fetch(`https://graph.facebook.com/v20.0/me?access_token=${fb_page_token}`);
        const meData = await meRes.json() as any;
        if (meData && meData.id) {
          realPageId = meData.id;
        }
      } catch (e) {
        console.warn('Lỗi phân giải Page ID:', e);
      }

      // Sinh nội dung bằng Gemini
      const postContent = await generateAIContent(
        activeGeminiKey,
        product_name || 'Sản phẩm số',
        product_desc || 'Tài liệu chất lượng cao',
        style || 'Thuyết phục',
        bio_url || 'https://quick-bio-lilac.vercel.app'
      );

      // Đăng lên Facebook
      const fbResult = await postToFacebook(realPageId, fb_page_token, postContent);

      return res.status(200).json({
        success: true,
        message: 'Đăng bài thử nghiệm thành công!',
        post: postContent,
        fb_response: fbResult
      });
    }

    // 2. Chạy tự động (Cron Job) quét toàn bộ Creator đang kích hoạt
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ message: 'Chưa cấu hình Supabase Admin Client' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Lấy danh sách cấu hình đang kích hoạt
    const { data: configs, error: configError } = await supabaseAdmin
      .from('marketing_settings')
      .select('*, profiles(*)')
      .eq('is_active', true);

    if (configError || !configs || configs.length === 0) {
      return res.status(200).json({ message: 'Không có chiến dịch marketing nào đang kích hoạt.' });
    }

    const results = [];

    for (const config of configs) {
      try {
        // Tránh spam: kiểm tra thời gian đăng bài gần nhất (phải cách nhau ít nhất 12 tiếng)
        const lastPosted = config.last_posted_at ? new Date(config.last_posted_at).getTime() : 0;
        const now = Date.now();
        if (now - lastPosted < 12 * 60 * 60 * 1000) {
          results.push({ user_id: config.user_id, status: 'skipped', reason: 'Vừa đăng bài trong vòng 12 tiếng qua' });
          continue;
        }

        let productName = '';
        let productDesc = '';
        let bioUrl = '';

        if (config.target_product_id === 'quickbio-platform') {
          productName = 'quickbio-platform';
          productDesc = 'Nền tảng Bio-Link và Cửa hàng sản phẩm số tự động nhận VietQR';
          
          const affCode = config.profiles?.affiliate_code || '';
          bioUrl = affCode 
            ? `https://quick-bio-lilac.vercel.app?ref=${affCode}` 
            : `https://quick-bio-lilac.vercel.app`;
        } else {
          // Lấy sản phẩm cần quảng bá
          const { data: product } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('id', config.target_product_id)
            .single();

          if (!product) {
            results.push({ user_id: config.user_id, status: 'failed', reason: 'Không tìm thấy sản phẩm quảng bá' });
            continue;
          }
          productName = product.name;
          productDesc = product.description;

          // Lấy thông tin Bio Link để chèn vào bài viết
          const { data: bio } = await supabaseAdmin
            .from('bio_links')
            .select('slug')
            .eq('user_id', config.user_id)
            .eq('status', 'published')
            .single();

          bioUrl = bio ? `https://quick-bio-lilac.vercel.app/b/${bio.slug}` : `https://quick-bio-lilac.vercel.app`;
        }

        const activeGeminiKey = config.gemini_api_key || fallbackGeminiKey;
        if (!activeGeminiKey) {
          results.push({ user_id: config.user_id, status: 'failed', reason: 'Thiếu API Key Gemini' });
          continue;
        }

        // Sinh nội dung bài đăng
        const postContent = await generateAIContent(
          activeGeminiKey,
          productName,
          productDesc,
          config.style,
          bioUrl
        );

        // Tự động phân giải Page ID chuẩn từ Token
        let realPageId = config.fb_page_id;
        try {
          const meRes = await fetch(`https://graph.facebook.com/v20.0/me?access_token=${config.fb_page_token}`);
          const meData = await meRes.json() as any;
          if (meData && meData.id) {
            realPageId = meData.id;
          }
        } catch (e) {
          console.warn('Lỗi phân giải Page ID trong cron:', e);
        }

        // Đăng lên Facebook
        await postToFacebook(realPageId, config.fb_page_token, postContent);

        // Cập nhật ngày đăng gần nhất
        await supabaseAdmin
          .from('marketing_settings')
          .update({ last_posted_at: new Date().toISOString() })
          .eq('user_id', config.user_id);

        results.push({ user_id: config.user_id, status: 'success' });
      } catch (err: any) {
        console.error(`Lỗi chạy autopost cho user ${config.user_id}:`, err);
        results.push({ user_id: config.user_id, status: 'failed', error: err.message });
      }
    }

    return res.status(200).json({ success: true, results });
  } catch (err: any) {
    console.error('Autopost global error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Hàm gọi API Gemini sinh nội dung
async function generateAIContent(apiKey: string, productName: string, productDesc: string, style: string, bioUrl: string): Promise<string> {
  const isPlatformPromotion = productName === 'quickbio-platform';
  
  let prompt = '';
  if (isPlatformPromotion) {
    prompt = `Bạn là một chuyên gia Copywriter marketing đỉnh cao. 
Hãy viết một bài đăng Facebook cực kỳ thu hút, kích thích và có tính thuyết phục cao để giới thiệu và quảng bá nền tảng kiếm tiền online: "QuickBio" - Công cụ tạo Bio-Link và bán sản phẩm số tự động nhận VietQR cá nhân.
Mô tả nền tảng: "Giúp bất kỳ ai cũng có thể bắt đầu kiếm tiền online bằng cách đăng bán ebook, template, khóa học và tự động nhận thanh toán qua VietQR cá nhân, tự động giao file trong 3 giây. Có chương trình Affiliate chia sẻ hoa hồng 50% trọn đời."
Mục tiêu bài viết: Thuyết phục mọi người đăng ký tài khoản miễn phí để tạo Bio Link bán sản phẩm số của riêng họ hoặc tham gia làm Cộng Tác Viên (Affiliate) để nhận 50% hoa hồng trọn đời.
Bài viết phải chèn khéo léo link đăng ký giới thiệu của tôi: "${bioUrl}".
Phong cách viết bài: ${style} (ví dụ: Thuyết phục, Hài hước, Giật gân, Kể chuyện).
Hãy sử dụng thêm các emoji bắt mắt, định dạng rõ ràng, xuống dòng dễ đọc và các hashtag phù hợp ở cuối bài.
KHÔNG viết các phần giải thích tiêu đề hay lời mở đầu, hãy trả về trực tiếp nội dung bài đăng Facebook hoàn chỉnh.`;
  } else {
    prompt = `Bạn là một chuyên gia Copywriter bán hàng đỉnh cao. 
Hãy viết một bài đăng Facebook cực kỳ hấp dẫn, thu hút người đọc để quảng bá sản phẩm số: "${productName}" (Mô tả: "${productDesc}").
Bài viết phải chèn khéo léo link cửa hàng Bio của tôi: "${bioUrl}".
Phong cách viết bài: ${style} (ví dụ: Thuyết phục, Hài hước, Giật gân, Kể chuyện).
Hãy sử dụng thêm các emoji bắt mắt, định dạng rõ ràng, xuống dòng dễ đọc và các hashtag phù hợp ở cuối bài.
KHÔNG viết các phần giải thích tiêu đề hay lời mở đầu, hãy trả về trực tiếp nội dung bài đăng Facebook hoàn chỉnh.`;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const resData = await response.json() as any;
    const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return text.trim();
    }
  } catch (err) {
    console.warn('Lỗi gọi Gemini hoặc hết lượt dùng thử, chuyển sang bài viết mẫu:', err);
  }

  // Fallback khi API bị lỗi / giới hạn
  return getFallbackContent(productName, productDesc, style, bioUrl);
}

// Hàm lấy nội dung bài viết tiếp thị dự phòng chất lượng cao
function getFallbackContent(productName: string, productDesc: string, style: string, bioUrl: string): string {
  const isPlatformPromotion = productName === 'quickbio-platform';
  
  if (isPlatformPromotion) {
    const fallbacks = [
      `🔥 CƠ HỘI TẠO THU NHẬP THỤ ĐỘNG 10 TRIỆU/THÁNG TỪ SẢN PHẨM SỐ!

Bạn đang có các tài liệu hay, Ebook tự viết, file thiết kế Canva hoặc các prompt chất lượng nhưng để bụi?
Hãy dùng ngay QuickBio - nền tảng tạo trang bán hàng Bio-Link cực nhanh:
✅ Nhận thanh toán VietQR ngân hàng cá nhân tự động.
✅ Tự động gửi file/link tải cho khách qua Email trong 3 giây.
✅ CTV giới thiệu nhận ngay 50% hoa hồng trọn đời.

👉 Đăng ký tài khoản hoặc đăng ký Cộng tác viên miễn phí ngay tại: ${bioUrl} 🚀`,

      `💡 Làm thế nào để biến lượt xem trên mạng xã hội thành dòng tiền tự động?

Câu trả lời là bán sản phẩm số (Ebook, Canva Template, Prompts AI) thông qua trang Bio-Link của QuickBio. 
Không cần lập trình phức tạp, thanh toán VietQR quét mã tự động chuyển khoản trực tiếp vào tài khoản ngân hàng của bạn, tự động giao hàng qua email tức thì.

👉 Bắt đầu xây dựng cỗ máy kiếm tiền tự động của bạn ngay hôm nay tại: ${bioUrl} 💸`,

      `QUYẾT ĐỊNH NGỪNG LÀM THUÊ VÀ BẮT ĐẦU KINH DOANH SẢN PHẨM SỐ TỰ ĐỘNG! 

Với QuickBio, bạn không cần có công ty để đăng ký cổng thanh toán. Dùng VietQR ngân hàng cá nhân của chính bạn để tự động nhận tiền 24/7 và giao tài liệu tự động cho khách hàng.
Đặc biệt, chương trình chia sẻ 50% doanh thu giới thiệu giúp bạn có nguồn thu nhập thụ động bền vững hàng tháng.

👉 Xem chi tiết và đăng ký miễn phí tại: ${bioUrl} 🌟`
    ];
    
    const randomIndex = Math.floor(Math.random() * fallbacks.length);
    return fallbacks[randomIndex];
  } else {
    return `🔥 KHÁM PHÁ NGAY: ${productName.toUpperCase()}!
👉 ${productDesc}

Đừng bỏ lỡ tài liệu/sản phẩm chất lượng cao này để tối ưu hóa công việc và cuộc sống của bạn. 
Nhận tài liệu tự động ngay sau khi thanh toán VietQR chuyển khoản cá nhân nhanh chóng!

📥 Tải về trực tiếp tại link Bio của mình: ${bioUrl} 🚀`;
  }
}

// Hàm gọi API Facebook Graph đăng bài
async function postToFacebook(pageId: string, pageToken: string, message: string): Promise<any> {
  const response = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      message: message,
      access_token: pageToken
    }).toString()
  });

  const resData = await response.json() as any;
  if (resData && resData.error) {
    throw new Error(resData.error.message || 'Lỗi đăng bài lên Facebook Graph API');
  }
  return resData;
}
