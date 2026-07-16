-- Create articles table
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  slug text not null,
  content text not null,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  moderation_status text not null default 'approved' check (moderation_status in ('approved', 'warned', 'suspended')),
  warning_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (slug)
);

-- Bật RLS
alter table public.articles enable row level security;

-- Policies
create policy "Public can view published and approved articles"
  on public.articles for select
  using (status = 'published' and moderation_status != 'suspended');

create policy "Users can view their own articles"
  on public.articles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own articles"
  on public.articles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own articles"
  on public.articles for update
  using (auth.uid() = user_id);

create policy "Users can delete their own articles"
  on public.articles for delete
  using (auth.uid() = user_id);

-- Lưu ý: Super Admin sẽ lấy danh sách thông qua RPC hoặc được cấp quyền bypass RLS
-- Ở đây ta cấp quyền Update moderation_status cho Admin thông qua RPC hoặc bypass 
-- (Nếu gọi từ Frontend bằng tài khoản có role='admin', có thể cần viết riêng Policy)
-- Để dễ cho frontend, ta thêm policy cho admin được đọc tất cả và update mọi bài viết:
create policy "Admins can view all articles"
  on public.articles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and (role = 'admin' or email in ('luan.nguyenthien@gmail.com', 'luannguyenthien@gmail.com', 'luannguyen@quickbio.vn'))
    )
  );

create policy "Admins can update any article"
  on public.articles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and (role = 'admin' or email in ('luan.nguyenthien@gmail.com', 'luannguyenthien@gmail.com', 'luannguyen@quickbio.vn'))
    )
  );

create policy "Admins can delete any article"
  on public.articles for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and (role = 'admin' or email in ('luan.nguyenthien@gmail.com', 'luannguyenthien@gmail.com', 'luannguyen@quickbio.vn'))
    )
  );

-- Trigger cập nhật updated_at
create trigger handle_updated_at before update on public.articles
  for each row execute procedure moddatetime (updated_at);
