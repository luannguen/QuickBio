DO $$ 
DECLARE 
    v_creator_id UUID := '2a5a0e3e-fdd4-465a-a6f4-1c71437a91ec'::UUID; 
    v_product_id UUID;
    v_order_id UUID;
    v_result JSONB;
BEGIN
    -- Tạo Product test
    INSERT INTO public.products (user_id, name, description, price, file_url)
    VALUES (v_creator_id, 'Test Product', 'Description', 500000, 'http://test')
    RETURNING id INTO v_product_id;

    -- Tạo Order test
    INSERT INTO public.orders (product_id, customer_email, amount, status, payment_code, customer_name)
    VALUES (v_product_id, 'testwebhook@example.com', 500000, 'pending', 'QBMOCK1', 'Test Webhook User')
    RETURNING id INTO v_order_id;
    
    -- GỌI RPC MÔ PHỎNG SEPAY (LẦN 1 - THÀNH CÔNG)
    v_result := public.process_sepay_payment(
        'QBMOCK1', 500000, 'TX_MOCK_001', 'Chuyen khoan don hang QBMOCK1', 'sepay', 'in', '123456789'
    );
    RAISE NOTICE '=> LẦN 1 (Giao dịch mới): %', v_result;

    -- Kiểm tra DB order xem đã PAID chưa
    IF EXISTS (SELECT 1 FROM public.orders WHERE id = v_order_id AND status = 'paid') THEN
        RAISE NOTICE '=> TRẠNG THÁI ORDER: Đã chuyển sang PAID thành công!';
    ELSE
        RAISE NOTICE '=> TRẠNG THÁI ORDER: Vẫn là PENDING (Lỗi)';
    END IF;

    -- GỌI RPC MÔ PHỎNG SEPAY (LẦN 2 - BỊ CHẶN VÌ TRÙNG TX)
    v_result := public.process_sepay_payment(
        'QBMOCK1', 500000, 'TX_MOCK_001', 'Chuyen khoan don hang QBMOCK1', 'sepay', 'in', '123456789'
    );
    RAISE NOTICE '=> LẦN 2 (Trùng lặp id giao dịch): %', v_result;

    -- GỌI RPC MÔ PHỎNG SEPAY (LẦN 3 - ĐƠN ĐÃ THANH TOÁN)
    v_result := public.process_sepay_payment(
        'QBMOCK1', 500000, 'TX_MOCK_002', 'Chuyen khoan tiep', 'sepay', 'in', '123456789'
    );
    RAISE NOTICE '=> LẦN 3 (Thanh toán lại mã đơn cũ bằng TX mới): %', v_result;

    -- Cleanup dọn rác
    DELETE FROM public.products WHERE id = v_product_id;
    DELETE FROM public.transactions WHERE transaction_id IN ('TX_MOCK_001', 'TX_MOCK_002');
END $$;
