INSERT OR IGNORE INTO categories (id, name, slug, description, sort_order) VALUES
  ('cat-home', 'Nhà cửa', 'nha-cua', 'Những món đồ nhỏ cho không gian sống ấm áp.', 1),
  ('cat-living', 'Sống xanh', 'song-xanh', 'Lựa chọn thân thiện cho nhịp sống mỗi ngày.', 2),
  ('cat-stationery', 'Văn phòng phẩm', 'van-phong-pham', 'Vật dụng giản dị để ghi chép và sáng tạo.', 3),
  ('cat-gifts', 'Quà tặng', 'qua-tang', 'Món quà chỉn chu dành cho người bạn quý mến.', 4);

INSERT OR IGNORE INTO products
  (id, name, slug, short_description, description, price, original_price, category_id, image, stock, is_active)
VALUES
  ('p-ceramic-mug', 'Cốc gốm Sớm Mai', 'coc-gom-som-mai', 'Cốc gốm men mờ, vừa tay cho buổi sáng chậm rãi.', 'Tạo hình thủ công với lớp men màu cát dịu. Dung tích 320 ml, dùng được với máy rửa chén.', 189000, 219000, 'cat-home', '/images/coc-gom.svg', 24, 1),
  ('p-candle', 'Nến thơm Hiên Nhà', 'nen-thom-hien-nha', 'Hương gỗ tuyết tùng và vỏ cam dịu nhẹ.', 'Sáp thực vật đổ thủ công trong ly thủy tinh tái sử dụng. Thời gian cháy khoảng 35 giờ.', 259000, NULL, 'cat-home', '/images/nen-thom.svg', 18, 1),
  ('p-linen-pillow', 'Vỏ gối Vân Mây', 'vo-goi-van-may', 'Vải linen mềm, tông màu tự nhiên dễ phối.', 'Vỏ gối linen dệt thoáng khí, kích thước 45 x 45 cm, có khóa kéo ẩn.', 329000, 359000, 'cat-home', '/images/vo-goi.svg', 12, 1),
  ('p-wood-tray', 'Khay gỗ Bờ Suối', 'khay-go-bo-suoi', 'Khay gỗ sồi nhỏ cho góc trà và bàn làm việc.', 'Gỗ sồi hoàn thiện bằng dầu thực vật, bo tròn cạnh. Kích thước 24 x 16 cm.', 279000, NULL, 'cat-home', '/images/khay-go.svg', 15, 1),
  ('p-canvas-tote', 'Túi vải Đường Xa', 'tui-vai-duong-xa', 'Túi canvas dày, gọn nhẹ cho những chuyến đi ngắn.', 'May từ cotton canvas chắc chắn, quai đeo vai rộng và ngăn trong tiện dụng.', 219000, 249000, 'cat-living', '/images/tui-vai.svg', 30, 1),
  ('p-bottle', 'Bình giữ nhiệt Mạch Nước', 'binh-giu-nhiet-mach-nuoc', 'Bình thép không gỉ dung tích 500 ml.', 'Lớp cách nhiệt hai thành giữ đồ uống ấm hoặc mát. Nắp kín có vòng xách silicone.', 389000, NULL, 'cat-living', '/images/binh-nuoc.svg', 21, 1),
  ('p-bamboo-cutlery', 'Bộ thìa tre Nhẹ Nhàng', 'bo-thia-tre-nhe-nhang', 'Bộ muỗng đũa tre gọn trong túi vải.', 'Gồm muỗng, đũa và ống hút tre đã xử lý bề mặt, kèm cọ vệ sinh và túi cotton.', 99000, NULL, 'cat-living', '/images/bo-thia.svg', 40, 1),
  ('p-soap-dish', 'Khay xà phòng Đá Cuội', 'khay-xa-phong-da-cuoi', 'Khay gốm thoát nước giúp bánh xà phòng khô ráo.', 'Gốm nung nhiệt cao với rãnh thoát nước, mỗi chiếc có sắc độ men riêng biệt.', 119000, NULL, 'cat-living', '/images/khay-xa-phong.svg', 26, 1),
  ('p-notebook', 'Sổ tay Trang Giấy', 'so-tay-trang-giay', 'Sổ giấy kem định lượng dày, mở phẳng dễ viết.', 'Bìa giấy tái chế tối giản, 160 trang chấm nhẹ và gáy khâu thủ công.', 89000, 109000, 'cat-stationery', '/images/so-tay.svg', 50, 1),
  ('p-pen-set', 'Bộ bút Mực Nâu', 'bo-but-muc-nau', 'Hai cây bút gel nét mượt, thân màu đất ấm.', 'Bộ bút 0.5 mm dùng ruột thay thế phổ thông, phù hợp ghi chú và phác thảo.', 79000, NULL, 'cat-stationery', '/images/bo-but.svg', 44, 1),
  ('p-desk-calendar', 'Lịch bàn Mùa Nhỏ', 'lich-ban-mua-nho', 'Lịch để bàn 12 tháng với hình minh họa thực vật.', 'Giấy mỹ thuật không tráng phủ, đế gập bằng giấy cứng và bố cục ghi chú rộng.', 149000, NULL, 'cat-stationery', '/images/lich-ban.svg', 28, 1),
  ('p-bookmark', 'Bộ đánh dấu Lá Non', 'bo-danh-dau-la-non', 'Bốn thẻ đánh dấu sách in họa tiết lá tự vẽ.', 'Giấy dày phủ mờ, bo góc mềm và có dây cotton nhỏ ở đầu thẻ.', 59000, NULL, 'cat-stationery', '/images/danh-dau.svg', 60, 1),
  ('p-gift-box', 'Hộp quà An Yên', 'hop-qua-an-yen', 'Hộp quà phối sổ tay, nến thơm và thiệp nhỏ.', 'Bộ quà được đóng gói bằng hộp giấy kraft. Có thể thêm lời nhắn ở bước đặt hàng.', 459000, 499000, 'cat-gifts', '/images/hop-qua.svg', 10, 1),
  ('p-tea-set', 'Bộ trà Góc Vườn', 'bo-tra-goc-vuon', 'Cặp chén gốm nhỏ cho những phút nghỉ giữa ngày.', 'Hai chén gốm men xanh rêu, dung tích 120 ml mỗi chiếc, đóng hộp giấy bảo vệ.', 349000, NULL, 'cat-gifts', '/images/bo-tra.svg', 14, 1),
  ('p-postcard', 'Thiệp giấy Nắng Dịu', 'thiep-giay-nang-diu', 'Bộ sáu thiệp minh họa phong cảnh do Mộc Nhiên sáng tác.', 'In hai mặt trên giấy mỹ thuật, kèm phong bì giấy kraft cùng tông.', 69000, NULL, 'cat-gifts', '/images/thiep.svg', 35, 1),
  ('p-woven-basket', 'Giỏ đan Nếp Nhà', 'gio-dan-nep-nha', 'Giỏ đan cói nhỏ để sắp xếp vật dụng gọn gàng.', 'Đan thủ công từ sợi cói tự nhiên, phù hợp đựng phụ kiện hoặc khăn nhỏ.', 239000, 269000, 'cat-gifts', '/images/gio-coi.svg', 16, 1);
