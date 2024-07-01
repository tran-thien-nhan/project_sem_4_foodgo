package com.foodgo.model;

public enum ORDER_STATUS {

    PENDING,
    CONFIRMED,
    DELIVERING,
    COMPLETED,
    CANCELLED,
    CANCELLED_REFUNDED;

    private ORDER_STATUS[] next;

    public ORDER_STATUS[] getNext() {
        return next;
    }

    static {
        PENDING.next = new ORDER_STATUS[]{CONFIRMED};
        CONFIRMED.next = new ORDER_STATUS[]{DELIVERING};
        DELIVERING.next = new ORDER_STATUS[]{COMPLETED, CANCELLED};
        COMPLETED.next = new ORDER_STATUS[]{};
        CANCELLED.next = new ORDER_STATUS[]{CANCELLED_REFUNDED};
        CANCELLED_REFUNDED.next = new ORDER_STATUS[]{};
    }

    public boolean canTransitionTo(ORDER_STATUS nextStatus) {
        for (ORDER_STATUS status : this.next) {
            if (status == nextStatus) {
                return true;
            }
        }
        return false;
    }
}
