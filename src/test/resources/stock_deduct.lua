local stock = tonumber(redis.call("GET", KEYS[1]))  -- Lấy stock hiện tại
local qty = tonumber(ARGV[1])                       -- Số lượng muốn mua

if stock >= qty then
    redis.call("DECRBY", KEYS[1], qty)               -- Giảm stock
    return 1                                         -- Thành công
else
    return 0                                         -- Không đủ hàng
end
