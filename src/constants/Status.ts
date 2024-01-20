export enum Status {
    AVAILABLE = 'Còn hàng',
    OUT_OF_STOCK = 'Tạm hết hàng',
}

export enum OrderStatus {
    PENDING = 'Chờ xác nhận',
    PROCESSING = 'Đang giao',
    DELIVERED = 'Hoàn thành',
    CANCELLED = 'Đã hủy',
}
