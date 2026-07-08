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

      // Sinh nội dung bằng Gemini
      const postContent = await generateAIContent(
        activeGeminiKey,
        product_name || 'Sản phẩm số',
        product_desc || 'Tài liệu chất lượng cao',
        style || 'Thuyết phục',
        bio_url || 'https://quickbio.vn'
      );

      // Đăng lên Facebook
      const fbResult = await postToFacebook(fb_page_id, fb_page_token, postContent);

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

        // Đăng lên Facebook
        await postToFacebook(config.fb_page_id, config.fb_page_token, postContent);

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
Hãy viết một bài đăng Facebook cực kỳ thu hút, kích thích và có tính thuyết phục cao để giới thiệu và quảng bá nền tảng kiếm tiền online: "QuickBio.vn" - Công cụ tạo Bio-Link và bán sản phẩm số tự động nhận VietQR cá nhân.
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

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const resData = await response.json();
  const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error(JSON.stringify(resData) || 'Không thể tạo nội dung từ Gemini');
  }
  return text.trim();
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

  const resData = await response.json();
  if (resData.error) {
    throw new Error(resData.error.message || 'Lỗi đăng bài lên Facebook Graph API');
  }
  return resData;
}
