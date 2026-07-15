# BÁO CÁO PHÂN TÍCH KIẾN TRÚC & KẾ HOẠCH REFACTOR QUICKBIO
*Áp dụng Tiêu chuẩn ECC (Everything Claude Code) & AI Coding Rules*

---

## 1. Hiện Trạng & Đánh Giá Kiến Trúc (Architecture Audit)

Sau khi quét toàn bộ mã nguồn của dự án QuickBio và áp dụng bộ tiêu chuẩn từ **ECC** & **AI-CODING-RULES.md**, chúng tôi phát hiện một số điểm hạn chế nghiêm trọng về cấu trúc file và phân lớp (3-Layer Architecture):

### ❌ Vi phạm 1: Cực kỳ phình to (Fat Components - Vượt quá 300 dòng)
Quy tắc **AI-CODING-RULES.md (Mục 8.2 & 2.3)** quy định mỗi UI component/file phải có dung lượng dưới 300 dòng. Tuy nhiên, các file cốt lõi của dự án đều vượt ngưỡng này nhiều lần:
1. `src/features/landing/LandingPageDesktop.tsx` (~1000 dòng)
2. `src/features/landing/AIVoiceLandingPage.tsx` (~600 dòng)
3. `src/features/public-bio/PublicBio.tsx` (~500 dòng)
4. `src/features/landing/LandingPageMobile.tsx` (~500 dòng)
5. `src/features/bio-builder/BioBuilder.tsx` (~500 dòng)
6. `src/features/dashboard/Dashboard.tsx` (~600 dòng)

### ❌ Vi phạm 2: Trộn lẫn tầng UI và Logic (Vi phạm Mô hình 3 lớp)
Mô hình kiến trúc bắt buộc của dự án là **3-Layer: UI (Presentation) → Hook (Logic) → Service (Data)**. Tuy nhiên:
* `PublicBio.tsx` trực tiếp gọi các API/Services (`bioService.getBioBySlug`, `productService.getActiveProductsByUserId`), tự quản lý các side effects (Countdown timer, Social Proof toast scheduler, referrer tracking) và tự khai báo các SVG Social Icons cồng kềnh.
* `LandingPageMobile.tsx` và `LandingPageDesktop.tsx` tự xử lý các thao tác vuốt chạm (Swipes/Gestures), các state đóng mở AuthModal, FAQ, điều phối luồng mà không tách ra Hook.

### ❌ Vi phạm 3: Thiếu việc phân rã Component nhỏ (Sub-components)
Các giao diện hiển thị phức tạp như trang Public-Bio chứa nhiều khối UI độc lập (Countdown Banner, Profile Header, Social Links, Product List, Product Hero Banner, QR Payment Modal...) nhưng tất cả đang được viết liền mạch trong một file duy nhất, gây khó khăn cho việc bảo trì, tối ưu hóa Re-render và viết Unit/E2E Tests.

---

## 2. Phương Án & Thiết Kế Refactor (Proposed Refactor Design)

Để giải quyết triệt để các vi phạm trên mà không thay đổi bất kỳ logic nghiệp vụ hay API hiện tại (tuân thủ nguyên tắc **"Logic cũ, Áo mới"** của quy tắc 11.3), chúng tôi thiết lập mô hình tái cấu trúc như sau:

### 2.1. Tái cấu trúc tính năng Public-Bio (`src/features/public-bio/`)
Chúng ta sẽ chuyển đổi file đơn lẻ `PublicBio.tsx` thành một module thư mục chuẩn hóa:

```
src/features/public-bio/
├── ui/                         # Chỉ chứa UI components (Presentational Only)
│   ├── PublicBioLayout.tsx     # Layout chính phối hợp các sub-components
│   ├── CountdownBanner.tsx     # Banner FOMO đếm ngược
│   ├── ProfileHeader.tsx       # Avatar, title, bio text
│   ├── SocialLinks.tsx         # Các nút liên kết MXH
│   ├── ProductHero.tsx         # Banner sản phẩm nổi bật (Featured Product)
│   └── ProductGrid.tsx         # Lưới hiển thị danh sách sản phẩm
├── hooks/                      # Chứa toàn bộ Business Logic & State
│   ├── usePublicBio.ts         # Hook chính tải dữ liệu & quản lý checkout
│   ├── useCountdown.ts         # Hook quản lý Countdown timer
│   └── useSocialProof.ts       # Hook quản lý Social Proof Toast giả lập
├── components/                 # Các component phụ trợ nội bộ
│   └── SocialIcon.tsx          # Component gom toàn bộ inline SVG MXH
└── index.ts                    # Public API export PublicBio
```

#### Rationale (Lý do thiết kế):
* **useCountdown.ts & useSocialProof.ts**: Tách các logic đếm ngược và scheduler Toast giả lập ra các hook riêng biệt giúp mã nguồn sạch sẽ, có thể viết Unit Test cho logic thời gian và scheduler một cách độc lập.
* **SocialIcon.tsx**: Gom các SVG Social Icons vào một file giúp file UI chính không bị loãng bởi hàng chục dòng mã SVG dài dòng.
* **Component size**: Mọi file UI sau khi tách sẽ đều $\le 150$ dòng code, cực kỳ dễ đọc và bảo trì.

### 2.2. Tái cấu trúc tính năng Landing Page (`src/features/landing/`)
Tương tự, các file Landing Page cồng kềnh sẽ được tái cấu trúc:
* **Tách Hook `useLandingMobile.ts`**: Quản lý State đóng mở AuthModal, FAQ và logic cử chỉ vuốt chạm (Swipe Gestures) trên Mock Phone.
* **Tách Sub-component `PhoneMockup.tsx`**: Đóng gói giao diện và logic cử chỉ của mô hình điện thoại giả lập.

---

## 3. Lộ Trình Triển Khai & Kiểm Thử (Refactor Roadmap & Verification)

### Phase 1: Chuẩn bị & Setup thư mục
* Tạo cấu trúc thư mục mới cho `src/features/public-bio/`.
* Định nghĩa DTO và types rõ ràng cho các hook.

### Phase 2: Triển khai Hook Layer (Tách logic trước)
* Xây dựng `useCountdown.ts`, `useSocialProof.ts` và `usePublicBio.ts`.
* Đảm bảo các hook này giữ nguyên các lời gọi API đến `bioService` và `productService` hiện tại mà không thay đổi bất kỳ payload hay xử lý logic nào.

### Phase 3: Triển khai UI Layer (Tách giao diện)
* Xây dựng `SocialIcon.tsx` để tối ưu hóa code SVG.
* Phân rã các components: `CountdownBanner`, `ProfileHeader`, `SocialLinks`, `ProductHero`, `ProductGrid`.
* Lắp ghép lại vào `PublicBioLayout.tsx` và xuất ra ngoài qua `index.ts`.

### Phase 4: Xác minh & Biên dịch (Build Verification)
* Chạy `npm run build` để đảm bảo không có lỗi TypeScript hay cú pháp.
* Chạy thử nghiệm cục bộ để đảm bảo các tính năng (Countdown, Toast, link MXH, mở checkout modal) hoạt động chính xác 100% như cũ.
