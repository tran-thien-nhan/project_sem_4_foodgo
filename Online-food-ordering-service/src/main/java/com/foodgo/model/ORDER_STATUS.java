package com.foodgo.model;

public enum ORDER_STATUS {
    PENDING,
    CONFIRMED,
    DELIVERING,
    COMPLETED,
    CANCELLED;

    private ORDER_STATUS next;

    public ORDER_STATUS getNext() {
        return next;
    }

    static {
        PENDING.next = CONFIRMED;
        CONFIRMED.next = DELIVERING;
        DELIVERING.next = COMPLETED;
        COMPLETED.next = CANCELLED;
        CANCELLED.next = null; // CANCELLED không có trạng thái kế tiếp
    }

    public boolean canTransitionTo(ORDER_STATUS nextStatus) {
        return this.next == nextStatus;
    }
}
