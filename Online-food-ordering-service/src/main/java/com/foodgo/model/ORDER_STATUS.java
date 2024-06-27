package com.foodgo.model;

public enum ORDER_STATUS {
    PENDING,
    CONFIRMED,
    DELIVERING,
    DELIVERED,
    CANCELLED;

    private ORDER_STATUS next;

    public ORDER_STATUS getNext() {
        return next;
    }

    static {
        PENDING.next = CONFIRMED;
        CONFIRMED.next = DELIVERING;
        DELIVERING.next = DELIVERED;
        DELIVERED.next = null; // DELIVERED là trạng thái cuối cùng
        CANCELLED.next = null; // CANCELLED không có trạng thái kế tiếp
    }

    public boolean canTransitionTo(ORDER_STATUS nextStatus) {
        return this.next == nextStatus;
    }
}
