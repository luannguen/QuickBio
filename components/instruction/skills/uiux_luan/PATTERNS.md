# THỰC HÀNH TỐT (PATTERNS)

Áp dụng các Pattern sau để xây dựng giao diện chuẩn cấp độ Production.

## 1. COMPOSITION & REUSABILITY

**Pattern: Container & Presenter (Smart vs Dumb Components)**
- **Presenter (Dumb)**: Chỉ nhận props (data, callbacks) và hiển thị UI. Dễ dàng viết test, tái sử dụng.
- **Container (Smart)**: Gọi hooks API, quản lý state, tính toán logic và truyền dữ liệu xuống Presenter.

**Pattern: Slots / Compound Components**
Tránh việc truyền quá nhiều props vào một component. Dùng children và sub-components.
```tsx
// Thay vì:
// <Card title="News" description="Update" actionText="Save" onAction={...} />

// Dùng Compound:
<Card>
  <CardHeader>
    <CardTitle>News</CardTitle>
    <CardDescription>Update</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

## 2. STATE MANAGEMENT & DATA FETCHING

**Pattern: Mọi API Request Đều Có Loading & Error**
Kết hợp chặt chẽ việc query dữ liệu với UI States.
```tsx
const { data, isLoading, error } = useDataQuery();

if (isLoading) return <DataSkeleton />;
if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState type="no-data" />;

return <DataGrid items={data} />;
```

**Pattern: Optimistic Updates cho Tương Tác Nhanh**
Cho các action như Bookmark, Like, thay đổi trạng thái (Toggle), thay vì đợi API phản hồi mới đổi UI, hãy đổi UI trước (Optimistic) rồi rollback nếu API fail.

## 3. FORM UX

**Pattern: Ràng buộc Validation Phía Client & Server**
- Form phải được validate cơ bản phía Client (trống, sai định dạng email) để phản hồi tức thì.
- Phải map lỗi từ Backend trả về đúng vào field tương ứng.

**Pattern: Khóa (Disable) Khi Đang Submit**
```tsx
<Button type="submit" disabled={isSubmitting} className="relative">
  {isSubmitting && <Spinner className="absolute left-2" />}
  {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
</Button>
```

## 4. RESPONSIVE DESIGN

**Pattern: Bảng Dữ Liệu Tự Động Thích Ứng (Responsive Table)**
- View Desktop: Hiển thị dạng `<Table>`.
- View Mobile: Đổi giao diện hiển thị thành tập hợp các `<Card>` hoặc `<ListItem>` xếp dọc.

**Pattern: Mobile-First Stacking**
Sử dụng Flex hoặc Grid theo hướng stack (column) mặc định, chỉ trải ngang (row) ở màn lớn.
```tsx
<div className="flex flex-col md:flex-row gap-4">
  <Sidebar className="w-full md:w-1/4" />
  <MainContent className="w-full md:w-3/4" />
</div>
```

## 5. ACCESSIBILITY VÀ FEEDBACK

**Pattern: Accessible Dialogs/Modals**
- Focus bị bẫy (Trapped) bên trong Modal khi nó đang mở.
- Nút `Escape` có thể đóng Modal.
- Auto-focus vào nút "Close" hoặc "Cancel" đầu tiên.

**Pattern: Screen Reader Only (sr-only)**
Cho những thông tin biểu đồ trực quan, icon, cần có nhãn ẩn dành riêng cho máy đọc màn hình.
```tsx
<button>
  <IconTrash />
  <span className="sr-only">Xóa người dùng</span>
</button>
```

## 6. ROLE & PERMISSION GUARDING

**Pattern: Component Bảo Mật Tầng UI**
Wrap các element nhạy cảm bằng Component kiểm tra quyền.
```tsx
<RequireRole allowedRoles={['ADMIN', 'MANAGER']}>
  <Button variant="destructive">Xóa Hệ Thống</Button>
</RequireRole>
```
